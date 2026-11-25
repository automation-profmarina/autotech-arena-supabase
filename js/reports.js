/**
 * AUTOTECH ARENA - Módulo de Importação de Planilhas e Exportação de Relatórios (Excel & PDF)
 * Utiliza SheetJS (XLSX) e jsPDF + jsPDF-AutoTable para geração real de arquivos.
 */
window.AutoTechReports = (function () {
  function formatDateBR(isoStr) {
    if (!isoStr) return "-";
    const d = new Date(isoStr);
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function calcAccuracy(student) {
    if (!student.total_answered || student.total_answered === 0) return 0;
    return Math.round((student.correct_answers / student.total_answered) * 100);
  }

  /**
   * Lê arquivo CSV ou Excel (.xlsx / .xls) enviado pelo professor e extrai lista de alunos
   */
  async function parseSpreadsheetFile(file) {
    if (!window.XLSX) {
      throw new Error("Biblioteca SheetJS (XLSX) não carregada.");
    }

    const buffer = await file.arrayBuffer();
    const workbook = window.XLSX.read(buffer, { type: "array" });
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const rows = window.XLSX.utils.sheet_to_json(worksheet, { defval: "" });

    if (!rows || rows.length === 0) {
      throw new Error("A planilha está vazia.");
    }

    const parsed = [];
    for (const row of rows) {
      const keys = Object.keys(row);
      const nameKey =
        keys.find((k) => /^(nome|aluno|estudante|name|full_name)/i.test(k.trim())) || keys[0];
      const regKey = keys.find((k) => /^(matr|ra|codigo|id|registro|registration)/i.test(k.trim()));

      const fullName = String(row[nameKey] || "").trim();
      const registrationCode = regKey ? String(row[regKey] || "").trim() : "";

      if (fullName.length >= 2 && !/^(nome|aluno|estudante)$/i.test(fullName)) {
        parsed.push({ fullName, registrationCode });
      }
    }

    return parsed;
  }

  /**
   * Exporta Lista Oficial de PINs da Turma em Excel (.xlsx)
   */
  function exportPinsExcel(classInfo, students) {
    if (!window.XLSX) throw new Error("Biblioteca XLSX indisponível.");

    const rows = students.map((s, idx) => ({
      "#": idx + 1,
      Turma: classInfo.name,
      "Código da Turma": classInfo.class_code,
      "Nome do Aluno": s.full_name,
      "Matrícula / RA": s.registration_code || "-",
      "PIN Individual": s.pin_code
    }));

    const wb = window.XLSX.utils.book_new();
    const ws = window.XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 5 },
      { wch: 28 },
      { wch: 16 },
      { wch: 34 },
      { wch: 16 },
      { wch: 16 }
    ];
    window.XLSX.utils.book_append_sheet(wb, ws, "Credenciais_PIN");
    window.XLSX.writeFile(wb, `PINs_${classInfo.class_code}.xlsx`);
  }

  /**
   * Exporta Relatório Pedagógico Coletivo da Turma em Excel (.xlsx) com 3 abas
   */
  function exportClassExcel(classInfo, students, attempts) {
    if (!window.XLSX) throw new Error("Biblioteca XLSX indisponível.");

    const sorted = [...students].sort((a, b) => b.xp_total - a.xp_total);

    // Aba 1: Desempenho Consolidado por Aluno
    const studentRows = sorted.map((s, idx) => ({
      Posição: `${idx + 1}º`,
      "Nome do Aluno": s.full_name,
      "Matrícula / RA": s.registration_code || "-",
      "PIN Acesso": s.pin_code || "***",
      Nível: s.level,
      "XP Total": s.xp_total,
      "Desafios Concluídos": s.quizzes_completed,
      "Questões Respondidas": s.total_answered,
      Acertos: s.correct_answers,
      "Precisão (%)": `${calcAccuracy(s)}%`,
      "Tempo Médio/Questão (s)": s.avg_time_ms ? (s.avg_time_ms / 1000).toFixed(1) : "0.0",
      "Melhor Sequência": s.streak_best,
      "Conquistas Obtidas": Array.isArray(s.badges) ? s.badges.length : 0
    }));

    // Aba 2: Análise por Módulo Técnico
    const moduleStatsMap = {};
    for (const att of attempts) {
      if (!moduleStatsMap[att.module_id]) {
        moduleStatsMap[att.module_id] = {
          Módulo: att.module_title,
          "Total de Tentativas": 0,
          "Total de Questões": 0,
          "Total de Acertos": 0,
          "Soma Duração (s)": 0
        };
      }
      const m = moduleStatsMap[att.module_id];
      m["Total de Tentativas"] += 1;
      m["Total de Questões"] += Number(att.total_questions || 0);
      m["Total de Acertos"] += Number(att.correct_count || 0);
      m["Soma Duração (s)"] += Number(att.duration_seconds || 0);
    }

    const moduleRows = Object.values(moduleStatsMap).map((m) => ({
      Módulo: m["Módulo"],
      "Tentativas Realizadas": m["Total de Tentativas"],
      "Questões Respondidas": m["Total de Questões"],
      "Acertos Totais": m["Total de Acertos"],
      "Aproveitamento Médio (%)":
        m["Total de Questões"] > 0
          ? `${Math.round((m["Total de Acertos"] / m["Total de Questões"]) * 100)}%`
          : "0%",
      "Duração Média por Desafio (s)":
        m["Total de Tentativas"] > 0
          ? Math.round(m["Soma Duração (s)"] / m["Total de Tentativas"])
          : 0
    }));

    // Aba 3: Histórico Cronológico de Atividades
    const historyRows = attempts.map((a) => ({
      "Data / Hora": formatDateBR(a.created_at),
      Aluno: a.student_name,
      Matrícula: a.registration_code || "-",
      Módulo: a.module_title,
      Acertos: `${a.correct_count}/${a.total_questions}`,
      "Precisão (%)": `${Number(a.accuracy_pct).toFixed(0)}%`,
      "Duração (s)": a.duration_seconds,
      "XP Ganho": a.xp_earned
    }));

    const wb = window.XLSX.utils.book_new();
    const ws1 = window.XLSX.utils.json_to_sheet(studentRows);
    ws1["!cols"] = [
      { wch: 9 },
      { wch: 30 },
      { wch: 15 },
      { wch: 12 },
      { wch: 8 },
      { wch: 12 },
      { wch: 18 },
      { wch: 20 },
      { wch: 10 },
      { wch: 14 },
      { wch: 22 },
      { wch: 16 },
      { wch: 18 }
    ];
    window.XLSX.utils.book_append_sheet(wb, ws1, "Desempenho_Alunos");

    const ws2 = window.XLSX.utils.json_to_sheet(
      moduleRows.length > 0 ? moduleRows : [{ Aviso: "Nenhuma atividade registrada ainda." }]
    );
    ws2["!cols"] = [{ wch: 34 }, { wch: 20 }, { wch: 20 }, { wch: 16 }, { wch: 24 }, { wch: 26 }];
    window.XLSX.utils.book_append_sheet(wb, ws2, "Analise_Modulos");

    const ws3 = window.XLSX.utils.json_to_sheet(
      historyRows.length > 0 ? historyRows : [{ Aviso: "Nenhum histórico registrado ainda." }]
    );
    ws3["!cols"] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 15 },
      { wch: 32 },
      { wch: 12 },
      { wch: 14 },
      { wch: 14 },
      { wch: 12 }
    ];
    window.XLSX.utils.book_append_sheet(wb, ws3, "Historico_Atividades");

    window.XLSX.writeFile(wb, `Relatorio_Turma_${classInfo.class_code}.xlsx`);
  }

  /**
   * Exporta Relatório Coletivo da Turma em PDF (.pdf)
   */
  function exportClassPdf(classInfo, students, attempts) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("Biblioteca jsPDF não carregada.");
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

    const sorted = [...students].sort((a, b) => b.xp_total - a.xp_total);
    const activeStudents = sorted.filter((s) => s.quizzes_completed > 0).length;
    const totalCorrect = sorted.reduce((acc, s) => acc + (s.correct_answers || 0), 0);
    const totalAnswered = sorted.reduce((acc, s) => acc + (s.total_answered || 0), 0);
    const avgAccuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

    // Cabeçalho Institucional
    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 297, 28, "F");
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("AUTOTECH ARENA — RELATÓRIO PEDAGÓGICO DA TURMA", 14, 12);

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Turma: ${classInfo.name} (${classInfo.class_code})  |  Ano: ${classInfo.academic_year}  |  Emitido em: ${new Date().toLocaleString("pt-BR")}`,
      14,
      21
    );

    // Resumo Indicadores
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text(
      `Alunos Cadastrados: ${sorted.length}   |   Participação Ativa: ${activeStudents}   |   Média Geral de Acertos: ${avgAccuracy}%   |   Total de Desafios Concluídos: ${attempts.length}`,
      14,
      36
    );

    const bodyRows = sorted.map((s, idx) => [
      `${idx + 1}º`,
      s.full_name,
      s.registration_code || "-",
      `Nv. ${s.level}`,
      `${s.xp_total} XP`,
      s.quizzes_completed,
      `${s.correct_answers}/${s.total_answered}`,
      `${calcAccuracy(s)}%`,
      s.avg_time_ms ? `${(s.avg_time_ms / 1000).toFixed(1)}s` : "-"
    ]);

    doc.autoTable({
      startY: 42,
      head: [
        [
          "Rank",
          "Aluno",
          "Matrícula",
          "Nível",
          "XP Total",
          "Desafios",
          "Acertos",
          "Precisão",
          "Tempo Médio"
        ]
      ],
      body: bodyRows,
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [15, 23, 42], textColor: [6, 182, 212], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [241, 245, 249] }
    });

    doc.save(`Relatorio_Turma_${classInfo.class_code}.pdf`);
  }

  /**
   * Exporta Relatório Individual do Aluno em PDF (.pdf)
   */
  function exportStudentPdf(classInfo, student, studentAttempts) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      throw new Error("Biblioteca jsPDF não carregada.");
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFillColor(15, 23, 42);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(6, 182, 212);
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.text("AUTOTECH ARENA — BOLETIM INDIVIDUAL DE DESEMPENHO", 14, 13);

    doc.setTextColor(226, 232, 240);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Turma: ${classInfo.name} (${classInfo.class_code})  |  Gerado em: ${new Date().toLocaleString("pt-BR")}`,
      14,
      22
    );

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Aluno(a): ${student.full_name}`, 14, 40);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Matrícula / RA: ${student.registration_code || "Não informada"}`, 14, 47);
    doc.text(
      `Nível Alcançado: Nível ${student.level}   |   Pontuação Acumulada: ${student.xp_total} XP   |   Precisão Global: ${calcAccuracy(student)}%`,
      14,
      54
    );
    doc.text(
      `Desafios Concluídos: ${student.quizzes_completed}   |   Melhor Sequência (Combo): ${student.streak_best} acertos`,
      14,
      61
    );

    const rows = studentAttempts.map((a) => [
      formatDateBR(a.created_at),
      a.module_title,
      `${a.correct_count}/${a.total_questions}`,
      `${Number(a.accuracy_pct).toFixed(0)}%`,
      `${a.duration_seconds}s`,
      `+${a.xp_earned} XP`
    ]);

    doc.autoTable({
      startY: 68,
      head: [["Data / Hora", "Módulo Técnico", "Acertos", "Precisão", "Tempo", "XP"]],
      body:
        rows.length > 0
          ? rows
          : [["-", "Nenhuma atividade registrada até o momento", "-", "-", "-", "-"]],
      styles: { fontSize: 8.5, cellPadding: 2.8 },
      headStyles: { fillColor: [15, 23, 42], textColor: [6, 182, 212], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [241, 245, 249] }
    });

    const safeFileName = student.full_name.replace(/[^a-zA-Z0-9_-]/g, "_");
    doc.save(`Relatorio_${safeFileName}.pdf`);
  }

  /**
   * Abre janela otimizada de impressão com os Cartões de PIN da Turma
   */
  function printPinCards(classInfo, students) {
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      throw new Error("Permita pop-ups no navegador para imprimir os cartões de PIN.");
    }

    const cardsHtml = students
      .map(
        (s) => `
      <div style="border: 2px dashed #334155; border-radius: 10px; padding: 14px; background: #f8fafc; page-break-inside: avoid;">
        <div style="font-size: 11px; color: #0284c7; font-weight: bold; text-transform: uppercase;">AutoTech Arena • Credencial de Acesso</div>
        <div style="font-size: 16px; font-weight: bold; color: #0f172a; margin: 6px 0;">${s.full_name}</div>
        <div style="font-size: 12px; color: #475569;">Turma: <strong>${classInfo.name}</strong></div>
        <div style="display: flex; gap: 16px; margin-top: 10px; background: #0f172a; color: #fff; padding: 8px 12px; border-radius: 6px; font-family: monospace;">
          <div><span style="font-size: 10px; color: #94a3b8; display:block;">CÓDIGO TURMA</span><strong style="font-size: 15px; color: #38bdf8;">${classInfo.class_code}</strong></div>
          <div><span style="font-size: 10px; color: #94a3b8; display:block;">SEU PIN INDIVIDUAL</span><strong style="font-size: 15px; color: #fbbf24;">${s.pin_code}</strong></div>
        </div>
      </div>`
      )
      .join("");

    win.document.write(`
      <html>
        <head><title>Cartões PIN - ${classInfo.name}</title></head>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="margin-bottom: 4px;">Cartões de Acesso Individual — ${classInfo.name} (${classInfo.class_code})</h2>
          <p style="color: #475569; font-size: 13px; margin-bottom: 18px;">Recorte e entregue o PIN individual a cada estudante.</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px;">
            ${cardsHtml}
          </div>
          <script>window.onload = function() { window.print(); };<\/script>
        </body>
      </html>
    `);
    win.document.close();
  }

  return {
    parseSpreadsheetFile,
    exportPinsExcel,
    exportClassExcel,
    exportClassPdf,
    exportStudentPdf,
    printPinCards
  };
})();
