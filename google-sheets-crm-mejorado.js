// ============================================
// 📧 CRM MEJORADO - GOOGLE SHEETS + GMAIL
// ============================================

// --- CONFIGURACIÓN GLOBAL ---
const CONFIG = {
  SHEET_NAME: 'CRM - Seguimiento',
  DOMAIN_TO_EXCLUDE: 'honei.app',
  MAX_THREADS: 2000, // Límite de hilos a procesar
  PAGE_SIZE: 500,
  TIMEZONE: Session.getScriptTimeZone(),

  // Umbrales para categorización
  DIAS_PERDIDO: 30,      // Más de 30 días sin contacto = perdido
  DIAS_SEGUIMIENTO: 15,  // Entre 15-30 días = seguimiento urgente
  DIAS_ALERTA: 7,        // Entre 7-15 días = alerta
  MIN_CONTACTOS_NUEVO: 2 // Menos de 2 contactos = prospecto nuevo
};

// --- MENÚ PERSONALIZADO ---
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 CRM Herramientas')
    .addItem('🔄 Actualizar Datos Ahora', 'listarEnviadosAGoogleSheet_CRM')
    .addSeparator()
    .addItem('📊 Ver Estadísticas Avanzadas', 'mostrarEstadisticasAvanzadas')
    .addItem('🎯 Exportar Contactos Prioritarios', 'exportarContactosPrioritarios')
    .addSeparator()
    .addItem('⚙️ Configurar CRM', 'mostrarConfiguracion')
    .addToUi();
}

// --- FUNCIÓN PRINCIPAL MEJORADA ---
function listarEnviadosAGoogleSheet_CRM() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const ui = SpreadsheetApp.getUi();

  try {
    // Mostrar mensaje de inicio
    ui.alert('🔄 Actualizando CRM', 'Procesando correos enviados. Esto puede tardar unos segundos...', ui.ButtonSet.OK);

    const inicio = new Date();
    const hoy = new Date();

    // Obtener o crear la hoja
    let sheetSummary = ss.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheetSummary) {
      sheetSummary = ss.insertSheet(CONFIG.SHEET_NAME);
    }

    // Limpiar contenido previo
    sheetSummary.clear();

    // Crear encabezados mejorados
    crearEncabezados(sheetSummary);

    // Procesar correos de Gmail
    const recipientsData = procesarCorreosGmail();

    // Generar filas de datos
    const { summaryRows, stats } = generarDatosTabla(recipientsData, hoy);

    // Escribir datos en la hoja
    if (summaryRows.length > 0) {
      sheetSummary.getRange(2, 1, summaryRows.length, 6).setValues(summaryRows);
      aplicarFormatoCondicionalMejorado(sheetSummary, summaryRows.length);
      aplicarFormatoColumnas(sheetSummary);
    }

    // Dibujar dashboard mejorado
    dibujarDashboardMejorado(sheetSummary, stats);

    // Agregar timestamp de actualización
    const fin = new Date();
    const tiempoTotal = Math.round((fin - inicio) / 1000);
    sheetSummary.getRange(1, 10).setValue(`Última actualización: ${Utilities.formatDate(fin, CONFIG.TIMEZONE, "dd/MM/yyyy HH:mm")} (${tiempoTotal}s)`);

    // Mensaje de éxito
    ui.alert('✅ Actualización Completa',
             `CRM actualizado exitosamente.\n\n` +
             `📊 Total contactos: ${stats.total}\n` +
             `🔥 Prioritarios: ${stats.prioritarios}\n` +
             `⏰ Seguimiento: ${stats.seguimiento}\n` +
             `❄️ Perdidos: ${stats.perdidos}\n\n` +
             `⏱️ Tiempo: ${tiempoTotal} segundos`,
             ui.ButtonSet.OK);

  } catch (error) {
    ui.alert('❌ Error', `Ocurrió un error al actualizar el CRM:\n\n${error.message}\n\nPor favor, inténtalo de nuevo.`, ui.ButtonSet.OK);
    Logger.log('Error en listarEnviadosAGoogleSheet_CRM: ' + error.stack);
  }
}

// --- PROCESAR CORREOS DE GMAIL ---
function procesarCorreosGmail() {
  const recipientsData = {};
  const query = 'in:sent';
  let start = 0;
  let threads;
  let totalProcesados = 0;

  do {
    threads = GmailApp.search(query, start, CONFIG.PAGE_SIZE);

    for (let i = 0; i < threads.length; i++) {
      const msgs = threads[i].getMessages();

      for (let j = 0; j < msgs.length; j++) {
        const m = msgs[j];
        const rawDate = m.getDate();
        const to = m.getTo();
        const cc = m.getCc();

        // Procesar destinatarios (To y Cc)
        procesarDestinatarios(to, rawDate, recipientsData);
        procesarDestinatarios(cc, rawDate, recipientsData);
      }
    }

    start += threads.length;
    totalProcesados += threads.length;

    // Límite de seguridad
    if (start > CONFIG.MAX_THREADS) break;

  } while (threads.length === CONFIG.PAGE_SIZE);

  Logger.log(`Total hilos procesados: ${totalProcesados}`);
  return recipientsData;
}

// --- PROCESAR DIRECCIONES DE EMAIL ---
function procesarDestinatarios(headerString, fecha, recipientsData) {
  if (!headerString) return;

  const parts = headerString.split(',');

  for (let p = 0; p < parts.length; p++) {
    let addr = parts[p].trim();
    const match = addr.match(/<([^>]+)>/);
    const cleanEmail = match ? match[1].toLowerCase() : addr.toLowerCase();

    // Filtros de exclusión
    if (debeExcluirEmail(cleanEmail)) continue;

    // Actualizar datos del destinatario
    if (!recipientsData[cleanEmail]) {
      recipientsData[cleanEmail] = {
        count: 0,
        lastDate: fecha,
        firstDate: fecha
      };
    }

    recipientsData[cleanEmail].count += 1;

    if (fecha > recipientsData[cleanEmail].lastDate) {
      recipientsData[cleanEmail].lastDate = fecha;
    }

    if (fecha < recipientsData[cleanEmail].firstDate) {
      recipientsData[cleanEmail].firstDate = fecha;
    }
  }
}

// --- VERIFICAR SI SE DEBE EXCLUIR UN EMAIL ---
function debeExcluirEmail(email) {
  if (CONFIG.DOMAIN_TO_EXCLUDE && email.includes(CONFIG.DOMAIN_TO_EXCLUDE)) return true;
  if (email.includes('noreply') || email.includes('no-reply')) return true;
  if (email.includes('donotreply') || email.includes('do-not-reply')) return true;
  if (email.includes('mailer-daemon')) return true;
  return false;
}

// --- GENERAR DATOS PARA LA TABLA ---
function generarDatosTabla(recipientsData, hoy) {
  const summaryRows = [];
  const stats = {
    prioritarios: 0,
    seguimiento: 0,
    alerta: 0,
    perdidos: 0,
    total: 0,
    prospectos: 0,
    clientes: 0
  };

  // Ordenar por última fecha de contacto
  const keys = Object.keys(recipientsData).sort((a, b) =>
    recipientsData[b].lastDate - recipientsData[a].lastDate
  );

  for (let k = 0; k < keys.length; k++) {
    const email = keys[k];
    const data = recipientsData[email];

    const fechaUltimoContacto = Utilities.formatDate(data.lastDate, CONFIG.TIMEZONE, "dd/MM/yyyy");
    const diffMs = hoy.getTime() - data.lastDate.getTime();
    const diasSinContacto = Math.floor(diffMs / (1000 * 3600 * 24));

    // Determinar categoría
    const categoria = determinarCategoria(data.count, diasSinContacto);

    // Link de acción rápida
    const gmailSearchLink = `=HYPERLINK("https://mail.google.com/mail/u/0/#search/to:${email}"; "✉️ Ver")`;

    summaryRows.push([
      email,
      data.count,
      fechaUltimoContacto,
      diasSinContacto,
      categoria,
      gmailSearchLink
    ]);

    // Actualizar estadísticas
    actualizarEstadisticas(stats, categoria, data.count, diasSinContacto);
  }

  return { summaryRows, stats };
}

// --- DETERMINAR CATEGORÍA DEL CONTACTO ---
function determinarCategoria(numContactos, diasSinContacto) {
  if (diasSinContacto > CONFIG.DIAS_PERDIDO) {
    return '❄️ Perdido';
  } else if (diasSinContacto >= CONFIG.DIAS_SEGUIMIENTO) {
    return '⏰ Seguimiento';
  } else if (diasSinContacto >= CONFIG.DIAS_ALERTA) {
    return '⚠️ Alerta';
  } else if (numContactos <= CONFIG.MIN_CONTACTOS_NUEVO) {
    return '🆕 Prospecto';
  } else {
    return '✅ Activo';
  }
}

// --- ACTUALIZAR ESTADÍSTICAS ---
function actualizarEstadisticas(stats, categoria, numContactos, dias) {
  stats.total++;

  if (categoria === '❄️ Perdido') {
    stats.perdidos++;
  } else if (categoria === '⏰ Seguimiento') {
    stats.seguimiento++;
  } else if (categoria === '⚠️ Alerta') {
    stats.alerta++;
  } else if (categoria === '🆕 Prospecto') {
    stats.prospectos++;
    stats.prioritarios++;
  } else if (categoria === '✅ Activo') {
    stats.clientes++;
  }

  // Priorizar contactos con pocos emails y días pasando
  if (numContactos <= 3 && dias >= 5 && dias < CONFIG.DIAS_SEGUIMIENTO) {
    stats.prioritarios++;
  }
}

// --- CREAR ENCABEZADOS ---
function crearEncabezados(sheet) {
  const headers = [
    'Dirección Email',
    '# Envíos',
    'Último Contacto',
    'Días sin contactar',
    'Categoría',
    'Acción'
  ];

  const headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setValues([headers])
    .setBackground("#1a1a1a")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  sheet.setFrozenRows(1);
}

// --- APLICAR FORMATO A COLUMNAS ---
function aplicarFormatoColumnas(sheet) {
  // Ancho de columnas
  sheet.setColumnWidth(1, 250); // Email
  sheet.setColumnWidth(2, 80);  // # Envíos
  sheet.setColumnWidth(3, 110); // Último contacto
  sheet.setColumnWidth(4, 120); // Días sin contactar
  sheet.setColumnWidth(5, 120); // Categoría
  sheet.setColumnWidth(6, 80);  // Acción

  // Alineación
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    sheet.getRange(2, 2, lastRow - 1, 1).setHorizontalAlignment("center"); // # Envíos
    sheet.getRange(2, 3, lastRow - 1, 1).setHorizontalAlignment("center"); // Fecha
    sheet.getRange(2, 4, lastRow - 1, 1).setHorizontalAlignment("center"); // Días
    sheet.getRange(2, 5, lastRow - 1, 1).setHorizontalAlignment("center"); // Categoría
    sheet.getRange(2, 6, lastRow - 1, 1).setHorizontalAlignment("center"); // Acción
  }
}

// --- FORMATO CONDICIONAL MEJORADO ---
function aplicarFormatoCondicionalMejorado(sheet, numRows) {
  if (numRows === 0) return;

  const rangeDias = sheet.getRange(2, 4, numRows, 1);
  sheet.clearConditionalFormatRules();

  const rules = [
    // Perdidos (>30 días) - Rojo
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberGreaterThan(CONFIG.DIAS_PERDIDO)
      .setBackground("#f4c7c3")
      .setFontColor("#990000")
      .setRanges([rangeDias])
      .build(),

    // Seguimiento (15-30 días) - Naranja
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(CONFIG.DIAS_SEGUIMIENTO, CONFIG.DIAS_PERDIDO)
      .setBackground("#fce8b2")
      .setFontColor("#b45f06")
      .setRanges([rangeDias])
      .build(),

    // Alerta (7-15 días) - Amarillo
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberBetween(CONFIG.DIAS_ALERTA, CONFIG.DIAS_SEGUIMIENTO)
      .setBackground("#fff2cc")
      .setFontColor("#bf9000")
      .setRanges([rangeDias])
      .build(),

    // Activos (<7 días) - Verde
    SpreadsheetApp.newConditionalFormatRule()
      .whenNumberLessThan(CONFIG.DIAS_ALERTA)
      .setBackground("#d9ead3")
      .setFontColor("#38761d")
      .setRanges([rangeDias])
      .build()
  ];

  sheet.setConditionalFormatRules(rules);
}

// --- DASHBOARD MEJORADO ---
function dibujarDashboardMejorado(sheet, stats) {
  const col = 8; // Columna H

  // Título del Dashboard
  const titleRange = sheet.getRange(1, col, 1, 3);
  titleRange.merge()
    .setValue("📊 DASHBOARD CRM")
    .setBackground("#1155cc")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setFontSize(14)
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");

  // Métricas principales
  const metricas = [
    { label: "👥 TOTAL CONTACTOS", value: stats.total, color: "#cfe2f3", icon: "👥" },
    { label: "🔥 PRIORITARIOS", value: stats.prioritarios, color: "#f4cccc", icon: "🔥" },
    { label: "⏰ SEGUIMIENTO", value: stats.seguimiento, color: "#fce8b2", icon: "⏰" },
    { label: "⚠️ ALERTA", value: stats.alerta, color: "#fff2cc", icon: "⚠️" },
    { label: "❄️ PERDIDOS", value: stats.perdidos, color: "#d9d9d9", icon: "❄️" },
    { label: "✅ ACTIVOS", value: stats.clientes, color: "#d9ead3", icon: "✅" },
    { label: "🆕 PROSPECTOS", value: stats.prospectos, color: "#d0e0e3", icon: "🆕" }
  ];

  let currentRow = 3;
  metricas.forEach((metrica) => {
    // Etiqueta
    sheet.getRange(currentRow, col, 1, 2)
      .merge()
      .setValue(metrica.label)
      .setFontWeight("bold")
      .setFontSize(10)
      .setBackground("#f3f3f3")
      .setHorizontalAlignment("left");

    // Valor
    sheet.getRange(currentRow, col + 2)
      .setValue(metrica.value)
      .setBackground(metrica.color)
      .setFontWeight("bold")
      .setFontSize(16)
      .setHorizontalAlignment("center")
      .setBorder(true, true, true, true, null, null);

    currentRow++;
  });

  // Tasas de conversión
  currentRow++;
  sheet.getRange(currentRow, col, 1, 3)
    .merge()
    .setValue("📈 TASAS Y MÉTRICAS")
    .setBackground("#6fa8dc")
    .setFontColor("#ffffff")
    .setFontWeight("bold")
    .setHorizontalAlignment("center");

  currentRow++;
  const tasaActivos = stats.total > 0 ? ((stats.clientes / stats.total) * 100).toFixed(1) : 0;
  const tasaPerdidos = stats.total > 0 ? ((stats.perdidos / stats.total) * 100).toFixed(1) : 0;
  const promedioContactos = stats.total > 0 ? (stats.total / stats.total).toFixed(1) : 0;

  const tasas = [
    { label: "Tasa Activos", value: `${tasaActivos}%` },
    { label: "Tasa Perdidos", value: `${tasaPerdidos}%` },
    { label: "Requieren Acción", value: `${stats.prioritarios + stats.seguimiento}` }
  ];

  tasas.forEach((tasa) => {
    sheet.getRange(currentRow, col, 1, 2).merge().setValue(tasa.label).setFontSize(9);
    sheet.getRange(currentRow, col + 2).setValue(tasa.value).setFontWeight("bold").setHorizontalAlignment("center");
    currentRow++;
  });

  // Instrucciones
  currentRow += 2;
  sheet.getRange(currentRow, col, 2, 3)
    .merge()
    .setValue("💡 Usa el menú 'CRM Herramientas' para actualizar datos o ver estadísticas avanzadas.")
    .setFontStyle("italic")
    .setFontSize(9)
    .setWrap(true)
    .setVerticalAlignment("top");

  // Ajustar anchos de columnas del dashboard
  sheet.setColumnWidth(col, 140);
  sheet.setColumnWidth(col + 1, 90);
  sheet.setColumnWidth(col + 2, 80);
}

// --- ESTADÍSTICAS AVANZADAS ---
function mostrarEstadisticasAvanzadas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const ui = SpreadsheetApp.getUi();

  if (!sheet) {
    ui.alert('⚠️ Advertencia', 'Primero debes actualizar el CRM.', ui.ButtonSet.OK);
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) {
    ui.alert('⚠️ Advertencia', 'No hay datos para analizar.', ui.ButtonSet.OK);
    return;
  }

  // Calcular estadísticas avanzadas
  let totalEmails = 0;
  let maxDias = 0;
  let minDias = Infinity;
  let sumaDias = 0;

  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) { // Si hay email
      const envios = data[i][1] || 0;
      const dias = data[i][3] || 0;

      totalEmails += envios;
      sumaDias += dias;
      if (dias > maxDias) maxDias = dias;
      if (dias < minDias) minDias = dias;
    }
  }

  const numContactos = data.length - 1;
  const promedioDias = numContactos > 0 ? (sumaDias / numContactos).toFixed(1) : 0;
  const promedioEmails = numContactos > 0 ? (totalEmails / numContactos).toFixed(1) : 0;

  const mensaje =
    `📊 ESTADÍSTICAS AVANZADAS\n\n` +
    `📧 Total emails enviados: ${totalEmails}\n` +
    `👥 Total contactos únicos: ${numContactos}\n\n` +
    `⏱️ Promedio días sin contactar: ${promedioDias}\n` +
    `📨 Promedio emails por contacto: ${promedioEmails}\n\n` +
    `📈 Contacto más antiguo: ${maxDias} días\n` +
    `📉 Contacto más reciente: ${minDias} días`;

  ui.alert('📊 Estadísticas Avanzadas', mensaje, ui.ButtonSet.OK);
}

// --- EXPORTAR CONTACTOS PRIORITARIOS ---
function exportarContactosPrioritarios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(CONFIG.SHEET_NAME);
  const ui = SpreadsheetApp.getUi();

  if (!sheet) {
    ui.alert('⚠️ Advertencia', 'Primero debes actualizar el CRM.', ui.ButtonSet.OK);
    return;
  }

  // Crear nueva hoja para prioritarios
  let sheetPrioritarios = ss.getSheetByName('Prioritarios');
  if (sheetPrioritarios) {
    ss.deleteSheet(sheetPrioritarios);
  }
  sheetPrioritarios = ss.insertSheet('Prioritarios');

  const data = sheet.getDataRange().getValues();
  const prioritarios = [data[0]]; // Incluir encabezados

  // Filtrar contactos prioritarios
  for (let i = 1; i < data.length; i++) {
    const categoria = data[i][4];
    if (categoria && (categoria.includes('Prioritario') || categoria.includes('Prospecto') || categoria.includes('Seguimiento'))) {
      prioritarios.push(data[i]);
    }
  }

  if (prioritarios.length > 1) {
    sheetPrioritarios.getRange(1, 1, prioritarios.length, prioritarios[0].length).setValues(prioritarios);
    aplicarFormatoColumnas(sheetPrioritarios);
    ui.alert('✅ Exportación Completa', `Se exportaron ${prioritarios.length - 1} contactos prioritarios a la hoja 'Prioritarios'.`, ui.ButtonSet.OK);
  } else {
    ss.deleteSheet(sheetPrioritarios);
    ui.alert('ℹ️ Información', 'No hay contactos prioritarios para exportar.', ui.ButtonSet.OK);
  }
}

// --- CONFIGURACIÓN DEL CRM ---
function mostrarConfiguracion() {
  const ui = SpreadsheetApp.getUi();

  const mensaje =
    `⚙️ CONFIGURACIÓN ACTUAL DEL CRM\n\n` +
    `📊 Hoja de datos: ${CONFIG.SHEET_NAME}\n` +
    `🚫 Dominio excluido: ${CONFIG.DOMAIN_TO_EXCLUDE}\n` +
    `📬 Max hilos a procesar: ${CONFIG.MAX_THREADS}\n\n` +
    `📅 UMBRALES DE CATEGORIZACIÓN:\n` +
    `• Perdido: > ${CONFIG.DIAS_PERDIDO} días\n` +
    `• Seguimiento: ${CONFIG.DIAS_SEGUIMIENTO}-${CONFIG.DIAS_PERDIDO} días\n` +
    `• Alerta: ${CONFIG.DIAS_ALERTA}-${CONFIG.DIAS_SEGUIMIENTO} días\n` +
    `• Prospecto: < ${CONFIG.MIN_CONTACTOS_NUEVO} contactos\n\n` +
    `Para modificar estos valores, edita el objeto CONFIG en el código.`;

  ui.alert('⚙️ Configuración del CRM', mensaje, ui.ButtonSet.OK);
}
