// ============================================
// 📧 CRM - FUNCIONALIDADES AVANZADAS OPCIONALES
// ============================================
// Estas son funciones adicionales que puedes agregar
// al código principal para funcionalidades extra

// --- 1. AUTOMATIZACIÓN CON TRIGGERS ---
/**
 * Crea un trigger para actualizar el CRM automáticamente cada día
 */
function instalarTriggerDiario() {
  // Eliminar triggers existentes para evitar duplicados
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'listarEnviadosAGoogleSheet_CRM') {
      ScriptApp.deleteTrigger(trigger);
    }
  });

  // Crear nuevo trigger para las 8:00 AM
  ScriptApp.newTrigger('listarEnviadosAGoogleSheet_CRM')
    .timeBased()
    .atHour(8)
    .everyDays(1)
    .create();

  SpreadsheetApp.getUi().alert(
    '✅ Trigger Instalado',
    'El CRM se actualizará automáticamente cada día a las 8:00 AM',
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

/**
 * Elimina el trigger automático
 */
function desinstalarTriggerDiario() {
  const triggers = ScriptApp.getProjectTriggers();
  let eliminados = 0;

  triggers.forEach(trigger => {
    if (trigger.getHandlerFunction() === 'listarEnviadosAGoogleSheet_CRM') {
      ScriptApp.deleteTrigger(trigger);
      eliminados++;
    }
  });

  SpreadsheetApp.getUi().alert(
    '✅ Trigger Eliminado',
    `Se eliminaron ${eliminados} trigger(s) automático(s)`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// --- 2. ALERTAS POR EMAIL ---
/**
 * Envía un email con los contactos prioritarios
 */
function enviarAlertaContactosPrioritarios() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('CRM - Seguimiento');

  if (!sheet) {
    Logger.log('No hay datos para enviar');
    return;
  }

  const data = sheet.getDataRange().getValues();
  const prioritarios = [];

  // Filtrar contactos prioritarios
  for (let i = 1; i < data.length; i++) {
    const dias = data[i][3];
    const categoria = data[i][4];

    if (categoria && (categoria.includes('Prioritario') || categoria.includes('Seguimiento'))) {
      prioritarios.push({
        email: data[i][0],
        envios: data[i][1],
        ultimoContacto: data[i][2],
        dias: dias,
        categoria: categoria
      });
    }
  }

  if (prioritarios.length === 0) {
    Logger.log('No hay contactos prioritarios');
    return;
  }

  // Construir el email
  const emailBody = construirEmailAlerta(prioritarios);

  // Enviar email
  const destinatario = Session.getActiveUser().getEmail();
  MailApp.sendEmail({
    to: destinatario,
    subject: `🔥 CRM Alert: ${prioritarios.length} contactos requieren seguimiento`,
    htmlBody: emailBody
  });

  Logger.log(`Email enviado a ${destinatario} con ${prioritarios.length} contactos`);
}

/**
 * Construye el HTML del email de alerta
 */
function construirEmailAlerta(prioritarios) {
  let html = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; }
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #1155cc; color: white; padding: 10px; text-align: left; }
          td { border: 1px solid #ddd; padding: 8px; }
          tr:nth-child(even) { background-color: #f2f2f2; }
          .header { background-color: #1155cc; color: white; padding: 20px; text-align: center; }
          .footer { margin-top: 20px; padding: 10px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🔥 Alerta CRM - Contactos Prioritarios</h1>
        </div>
        <p>Tienes <strong>${prioritarios.length}</strong> contactos que requieren seguimiento:</p>
        <table>
          <tr>
            <th>Email</th>
            <th># Envíos</th>
            <th>Último Contacto</th>
            <th>Días</th>
            <th>Categoría</th>
          </tr>
  `;

  prioritarios.forEach(contacto => {
    html += `
      <tr>
        <td>${contacto.email}</td>
        <td>${contacto.envios}</td>
        <td>${contacto.ultimoContacto}</td>
        <td>${contacto.dias}</td>
        <td>${contacto.categoria}</td>
      </tr>
    `;
  });

  html += `
        </table>
        <div class="footer">
          <p>Este es un email automático generado por tu CRM de Google Sheets.</p>
          <p>Fecha: ${new Date().toLocaleString('es-ES')}</p>
        </div>
      </body>
    </html>
  `;

  return html;
}

// --- 3. ANÁLISIS DE RESPUESTAS ---
/**
 * Analiza la tasa de respuesta de tus emails
 * NOTA: Esto requiere buscar emails recibidos de tus contactos
 */
function analizarTasaRespuesta() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('CRM - Seguimiento');

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  let totalContactos = 0;
  let conRespuesta = 0;

  for (let i = 1; i < data.length; i++) {
    const email = data[i][0];
    if (!email) continue;

    totalContactos++;

    // Buscar si hay respuestas de este contacto
    const threads = GmailApp.search(`from:${email}`, 0, 5);
    if (threads.length > 0) {
      conRespuesta++;
    }
  }

  const tasaRespuesta = totalContactos > 0 ? ((conRespuesta / totalContactos) * 100).toFixed(1) : 0;

  SpreadsheetApp.getUi().alert(
    '📊 Análisis de Respuestas',
    `Total contactos: ${totalContactos}\n` +
    `Con respuestas: ${conRespuesta}\n` +
    `Tasa de respuesta: ${tasaRespuesta}%`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// --- 4. ETIQUETAS PERSONALIZADAS ---
/**
 * Agrega una columna de etiquetas personalizadas
 */
function agregarColumnaEtiquetas() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('CRM - Seguimiento');

  if (!sheet) return;

  // Agregar encabezado de etiqueta en columna 7
  sheet.getRange(1, 7).setValue('Etiqueta').setBackground("#1a1a1a").setFontColor("#ffffff").setFontWeight("bold");

  // Agregar validación de datos con opciones predefinidas
  const lastRow = sheet.getLastRow();
  if (lastRow > 1) {
    const etiquetas = ['Cliente', 'Prospecto', 'Socio', 'Proveedor', 'Otro'];
    const rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(etiquetas, true)
      .build();

    sheet.getRange(2, 7, lastRow - 1, 1).setDataValidation(rule);
  }

  SpreadsheetApp.getUi().alert('✅ Columna de etiquetas agregada');
}

// --- 5. EXPORTAR A CSV ---
/**
 * Exporta los contactos prioritarios a CSV
 */
function exportarPrioritariosCSV() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('CRM - Seguimiento');

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  let csvContent = data[0].join(',') + '\n'; // Encabezados

  // Filtrar y agregar prioritarios
  for (let i = 1; i < data.length; i++) {
    const categoria = data[i][4];
    if (categoria && (categoria.includes('Prioritario') || categoria.includes('Prospecto'))) {
      csvContent += data[i].join(',') + '\n';
    }
  }

  // Crear archivo en Drive
  const fileName = `CRM_Prioritarios_${new Date().toISOString().slice(0, 10)}.csv`;
  const file = DriveApp.createFile(fileName, csvContent, MimeType.CSV);

  SpreadsheetApp.getUi().alert(
    '✅ Exportación Completa',
    `Archivo creado: ${fileName}\nURL: ${file.getUrl()}`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// --- 6. CREAR EVENTOS DE CALENDARIO ---
/**
 * Crea recordatorios en Google Calendar para contactos prioritarios
 */
function crearRecordatoriosCalendar() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('CRM - Seguimiento');
  const calendar = CalendarApp.getDefaultCalendar();

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  let eventosCreados = 0;

  for (let i = 1; i < data.length; i++) {
    const email = data[i][0];
    const categoria = data[i][4];
    const dias = data[i][3];

    // Crear recordatorio solo para prioritarios
    if (categoria && (categoria.includes('Prioritario') || dias > 15)) {
      const titulo = `🔔 Follow-up: ${email}`;
      const descripcion = `Contactar a ${email}\nÚltimo contacto: ${data[i][2]}\nDías sin contactar: ${dias}`;

      // Crear evento para mañana a las 9:00 AM
      const mañana = new Date();
      mañana.setDate(mañana.getDate() + 1);
      mañana.setHours(9, 0, 0, 0);

      const finEvento = new Date(mañana.getTime() + 30 * 60000); // 30 minutos después

      calendar.createEvent(titulo, mañana, finEvento, { description: descripcion });
      eventosCreados++;
    }
  }

  SpreadsheetApp.getUi().alert(
    '✅ Recordatorios Creados',
    `Se crearon ${eventosCreados} eventos en tu calendario para mañana a las 9:00 AM`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// --- 7. GRÁFICOS CON GOOGLE CHARTS ---
/**
 * Crea una hoja con gráficos visuales
 */
function crearHojaGraficos() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheetDatos = ss.getSheetByName('CRM - Seguimiento');

  if (!sheetDatos) return;

  // Crear nueva hoja para gráficos
  let sheetGraficos = ss.getSheetByName('Gráficos CRM');
  if (sheetGraficos) {
    ss.deleteSheet(sheetGraficos);
  }
  sheetGraficos = ss.insertSheet('Gráficos CRM');

  // Preparar datos para gráfico de categorías
  const data = sheetDatos.getDataRange().getValues();
  const categorias = {};

  for (let i = 1; i < data.length; i++) {
    const categoria = data[i][4];
    if (categoria) {
      categorias[categoria] = (categorias[categoria] || 0) + 1;
    }
  }

  // Escribir datos para el gráfico
  const chartData = [['Categoría', 'Cantidad']];
  Object.keys(categorias).forEach(cat => {
    chartData.push([cat, categorias[cat]]);
  });

  sheetGraficos.getRange(1, 1, chartData.length, 2).setValues(chartData);

  // Crear gráfico de barras
  const chartBuilder = sheetGraficos.newChart()
    .setChartType(Charts.ChartType.BAR)
    .addRange(sheetGraficos.getRange(1, 1, chartData.length, 2))
    .setPosition(5, 5, 0, 0)
    .setOption('title', '📊 Distribución de Contactos por Categoría')
    .setOption('width', 600)
    .setOption('height', 400)
    .setOption('colors', ['#1155cc']);

  sheetGraficos.insertChart(chartBuilder.build());

  SpreadsheetApp.getUi().alert('✅ Hoja de gráficos creada');
}

// --- 8. BÚSQUEDA AVANZADA ---
/**
 * Busca contactos por criterios específicos
 */
function buscarContacto() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '🔍 Buscar Contacto',
    'Ingresa el email o parte del email a buscar:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const busqueda = response.getResponseText().toLowerCase();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('CRM - Seguimiento');

  if (!sheet) return;

  const data = sheet.getDataRange().getValues();
  const resultados = [];

  for (let i = 1; i < data.length; i++) {
    const email = String(data[i][0]).toLowerCase();
    if (email.includes(busqueda)) {
      resultados.push(data[i]);
    }
  }

  if (resultados.length === 0) {
    ui.alert('❌ Sin Resultados', 'No se encontraron contactos que coincidan.', ui.ButtonSet.OK);
    return;
  }

  // Crear hoja temporal con resultados
  let sheetResultados = ss.getSheetByName('Resultados Búsqueda');
  if (sheetResultados) {
    ss.deleteSheet(sheetResultados);
  }
  sheetResultados = ss.insertSheet('Resultados Búsqueda');

  sheetResultados.getRange(1, 1, 1, data[0].length).setValues([data[0]]);
  sheetResultados.getRange(2, 1, resultados.length, resultados[0].length).setValues(resultados);

  ss.setActiveSheet(sheetResultados);

  ui.alert(
    '✅ Búsqueda Completa',
    `Se encontraron ${resultados.length} contacto(s).\nRevisa la hoja "Resultados Búsqueda".`,
    ui.ButtonSet.OK
  );
}

// --- 9. HISTORIAL DE CAMBIOS ---
/**
 * Guarda un snapshot del CRM para tracking histórico
 */
function guardarSnapshotHistorico() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('CRM - Seguimiento');

  if (!sheet) return;

  const fecha = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd');
  const nombreSnapshot = `Snapshot_${fecha}`;

  // Verificar si ya existe
  let sheetSnapshot = ss.getSheetByName(nombreSnapshot);
  if (sheetSnapshot) {
    ss.deleteSheet(sheetSnapshot);
  }

  // Duplicar hoja actual
  sheetSnapshot = sheet.copyTo(ss);
  sheetSnapshot.setName(nombreSnapshot);

  SpreadsheetApp.getUi().alert(
    '✅ Snapshot Guardado',
    `Copia del CRM guardada como "${nombreSnapshot}"`,
    SpreadsheetApp.getUi().ButtonSet.OK
  );
}

// --- 10. TEMPLATES DE EMAIL ---
/**
 * Abre Gmail con un template de follow-up prellenado
 */
function crearEmailTemplate() {
  const ui = SpreadsheetApp.getUi();
  const response = ui.prompt(
    '✉️ Email Template',
    'Ingresa el email del destinatario:',
    ui.ButtonSet.OK_CANCEL
  );

  if (response.getSelectedButton() !== ui.Button.OK) return;

  const destinatario = response.getResponseText();

  // Template de follow-up
  const asunto = encodeURIComponent('Seguimiento - EF Oposiciones 21');
  const cuerpo = encodeURIComponent(
    `Hola,\n\n` +
    `Quería hacer un seguimiento sobre tu interés en nuestros servicios de preparación para oposiciones.\n\n` +
    `¿Tienes alguna pregunta que pueda resolver?\n\n` +
    `Saludos,\n` +
    `[Tu Nombre]`
  );

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${destinatario}&su=${asunto}&body=${cuerpo}`;

  const htmlOutput = HtmlService
    .createHtmlOutput(`<script>window.open('${gmailUrl}', '_blank'); google.script.host.close();</script>`)
    .setWidth(200)
    .setHeight(100);

  ui.showModalDialog(htmlOutput, 'Abriendo Gmail...');
}

// --- MENÚ ACTUALIZADO CON NUEVAS FUNCIONES ---
/**
 * Reemplaza la función onOpen() con esta versión que incluye las nuevas funciones
 */
function onOpen_Avanzado() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('🚀 CRM Herramientas')
    .addItem('🔄 Actualizar Datos Ahora', 'listarEnviadosAGoogleSheet_CRM')
    .addSeparator()
    .addSubMenu(ui.createMenu('📊 Análisis')
      .addItem('Ver Estadísticas Avanzadas', 'mostrarEstadisticasAvanzadas')
      .addItem('Analizar Tasa de Respuesta', 'analizarTasaRespuesta')
      .addItem('Crear Gráficos', 'crearHojaGraficos'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🎯 Acciones')
      .addItem('Exportar Contactos Prioritarios', 'exportarContactosPrioritarios')
      .addItem('Exportar a CSV', 'exportarPrioritariosCSV')
      .addItem('Buscar Contacto', 'buscarContacto')
      .addItem('Crear Email Template', 'crearEmailTemplate'))
    .addSeparator()
    .addSubMenu(ui.createMenu('⏰ Automatización')
      .addItem('Instalar Actualización Diaria', 'instalarTriggerDiario')
      .addItem('Desinstalar Actualización Diaria', 'desinstalarTriggerDiario')
      .addItem('Enviar Alerta por Email', 'enviarAlertaContactosPrioritarios')
      .addItem('Crear Recordatorios en Calendar', 'crearRecordatoriosCalendar'))
    .addSeparator()
    .addSubMenu(ui.createMenu('🛠️ Utilidades')
      .addItem('Agregar Columna Etiquetas', 'agregarColumnaEtiquetas')
      .addItem('Guardar Snapshot Histórico', 'guardarSnapshotHistorico')
      .addItem('Configurar CRM', 'mostrarConfiguracion'))
    .addToUi();
}

// ============================================
// INSTRUCCIONES DE USO
// ============================================
/*

Para usar estas funcionalidades avanzadas:

1. Copia las funciones que quieras usar
2. Pégalas en tu código principal (después del código base)
3. Opcionalmente, reemplaza la función onOpen() por onOpen_Avanzado()
4. Guarda y recarga tu Google Sheet

IMPORTANTE:
- Algunas funciones requieren permisos adicionales (Calendar, Drive)
- La primera vez que uses cada función, Google pedirá autorización
- Prueba cada función individualmente antes de usarla en producción

FUNCIONES RECOMENDADAS PARA EMPEZAR:
1. instalarTriggerDiario() - Actualización automática
2. enviarAlertaContactosPrioritarios() - Alertas diarias
3. crearRecordatoriosCalendar() - Integración con calendario

*/
