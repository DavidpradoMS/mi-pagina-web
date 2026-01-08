# 🚀 Guía Rápida - CRM Mejorado para Google Sheets

## ⚡ Instalación en 5 Pasos

### 1️⃣ Abre Google Sheets
- Ve a tu hoja de cálculo actual
- O crea una nueva en [sheets.google.com](https://sheets.google.com)

### 2️⃣ Abre el Editor de Scripts
- Haz clic en **Extensiones** → **Apps Script**
- Se abrirá una nueva pestaña con el editor de código

### 3️⃣ Reemplaza el Código
- Borra todo el código que aparece por defecto
- Copia y pega el contenido completo del archivo `google-sheets-crm-mejorado.js`
- Haz clic en el ícono de **guardar** 💾 (o Ctrl+S)

### 4️⃣ Autoriza los Permisos
- Haz clic en **Ejecutar** (▶️)
- Google pedirá autorización para acceder a Gmail
- Selecciona tu cuenta
- Haz clic en **Avanzado** → **Ir a [nombre del proyecto]**
- Autoriza los permisos

### 5️⃣ Recarga tu Google Sheet
- Vuelve a tu hoja de cálculo
- Recarga la página (F5)
- Verás el nuevo menú **🚀 CRM Herramientas**

---

## 📋 Primer Uso

1. Haz clic en **🚀 CRM Herramientas** → **🔄 Actualizar Datos Ahora**
2. Espera mientras el sistema procesa tus emails (puede tardar 30-60 segundos)
3. ¡Listo! Verás tu CRM completo con:
   - Lista de todos tus contactos
   - Dashboard con métricas
   - Categorización automática

---

## 🎯 Funciones Principales

### 🔄 Actualizar Datos Ahora
- **Qué hace:** Escanea tu Gmail y actualiza el CRM
- **Cuándo usarlo:** Diariamente o después de enviar emails importantes
- **Tiempo:** 30-60 segundos

### 📊 Ver Estadísticas Avanzadas
- **Qué hace:** Muestra análisis detallados de tus contactos
- **Incluye:** Total emails, promedios, contacto más antiguo/reciente
- **Cuándo usarlo:** Para decisiones estratégicas

### 🎯 Exportar Contactos Prioritarios
- **Qué hace:** Crea una hoja separada solo con contactos urgentes
- **Cuándo usarlo:** Cada mañana para tu lista de tareas del día

### ⚙️ Configurar CRM
- **Qué hace:** Muestra la configuración actual
- **Incluye:** Umbrales de días, filtros, límites

---

## 🎨 Entendiendo los Colores

### En la columna "Días sin contactar":

| Color | Días | Significado | Acción |
|-------|------|-------------|--------|
| 🟢 Verde | 0-6 | Activo | Mantener contacto |
| 🟡 Amarillo | 7-14 | Alerta | Considerar follow-up |
| 🟠 Naranja | 15-29 | Seguimiento | Follow-up urgente |
| 🔴 Rojo | 30+ | Perdido | Recuperar contacto |

---

## 📊 Entendiendo las Categorías

| Emoji | Categoría | Descripción |
|-------|-----------|-------------|
| 🆕 | Prospecto | Pocos contactos (< 2), cliente potencial |
| ✅ | Activo | Contacto frecuente y reciente |
| ⚠️ | Alerta | 7-15 días sin contacto |
| ⏰ | Seguimiento | 15-30 días sin contacto |
| ❄️ | Perdido | Más de 30 días sin contacto |

---

## 📊 Dashboard Explicado

### Métricas Principales:

**👥 TOTAL CONTACTOS**
- Número total de personas a las que has enviado emails

**🔥 PRIORITARIOS**
- Contactos que requieren acción inmediata
- Incluye prospectos y contactos en seguimiento

**⏰ SEGUIMIENTO**
- Contactos entre 15-30 días sin contactar

**⚠️ ALERTA**
- Contactos entre 7-15 días sin contactar

**❄️ PERDIDOS**
- Contactos con más de 30 días sin contactar

**✅ ACTIVOS**
- Contactos recientes (menos de 7 días)

**🆕 PROSPECTOS**
- Contactos nuevos con pocos emails enviados

### Tasas y Métricas:

**Tasa Activos**
- Porcentaje de contactos activos vs total

**Tasa Perdidos**
- Porcentaje de contactos perdidos vs total

**Requieren Acción**
- Suma de prioritarios + seguimiento

---

## 💡 Casos de Uso

### 📅 Rutina Matutina (5 minutos)
```
1. Actualizar CRM
2. Revisar Dashboard
3. Exportar Prioritarios
4. Contactar top 3-5 urgentes
```

### 📊 Análisis Semanal (15 minutos)
```
1. Actualizar CRM
2. Ver Estadísticas Avanzadas
3. Identificar tendencias
4. Planificar estrategia de la semana
```

### 🎯 Campaña de Recuperación (30 minutos)
```
1. Exportar Contactos Prioritarios
2. Filtrar contactos perdidos
3. Crear lista de recuperación
4. Enviar emails personalizados
```

---

## ⚙️ Personalización Básica

### Cambiar los umbrales de días:

1. En el editor de Apps Script, busca:
```javascript
const CONFIG = {
  DIAS_PERDIDO: 30,      // ← Cambia este número
  DIAS_SEGUIMIENTO: 15,  // ← Cambia este número
  DIAS_ALERTA: 7,        // ← Cambia este número
  // ...
};
```

2. Modifica los números según tus necesidades
3. Guarda (Ctrl+S)
4. Actualiza el CRM

### Excluir más dominios:

1. Busca la función `debeExcluirEmail`
2. Agrega líneas como:
```javascript
if (email.includes('tudominio.com')) return true;
```

---

## 🔧 Solución de Problemas Comunes

### ❌ "No tengo el menú CRM Herramientas"
**Solución:** Recarga la página (F5) y espera 5 segundos

### ⏰ "Tarda mucho tiempo"
**Solución:** Reduce `MAX_THREADS` a 1000 en el CONFIG

### 📧 "Faltan contactos"
**Solución:** Aumenta `MAX_THREADS` a 3000 en el CONFIG

### 🔒 "Error de permisos"
**Solución:** Ve a Apps Script → Ejecutar → Autoriza de nuevo

### 🎨 "Los colores no se ven"
**Solución:** Actualiza el CRM de nuevo

### 💾 "Perdí mis datos"
**Solución:** Ve a Archivo → Ver historial de versiones

---

## 📱 Uso desde Móvil

El CRM funciona desde la app de Google Sheets:

1. Abre la app de Google Sheets
2. Abre tu hoja del CRM
3. Toca los **tres puntos** (⋮) arriba a la derecha
4. No verás el menú personalizado, pero los datos se mantienen
5. **Recomendación:** Actualiza desde PC

---

## 🚀 Próximos Pasos Avanzados

Una vez que domines el CRM básico, puedes agregar:

1. **Automatización Diaria:** Actualización automática cada mañana
2. **Alertas por Email:** Recibe lista de prioritarios por correo
3. **Integración Calendar:** Crea recordatorios automáticos
4. **Gráficos:** Visualizaciones de tendencias
5. **Etiquetas:** Categorización personalizada por industria

Ver archivo `CRM-FUNCIONALIDADES-AVANZADAS.js` para estas funciones.

---

## 📊 Métricas de Éxito

Monitorea estas métricas cada semana:

- ✅ **Tasa de Activos:** Objetivo > 30%
- ❌ **Tasa de Perdidos:** Objetivo < 20%
- 📈 **Contactos Prioritarios:** Reducir semanalmente
- 💪 **Promedio días sin contactar:** Objetivo < 10 días

---

## 🎓 Tips Pro

1. **Actualiza el CRM antes de tu primera reunión del día**
2. **Revisa el dashboard antes de planificar tu semana**
3. **Usa los enlaces "✉️ Ver" para abrir conversaciones directamente**
4. **Exporta prioritarios y pégalos en tu lista de tareas**
5. **Guarda snapshots mensuales para tracking histórico**

---

## 📞 Recursos Adicionales

- **Documentación Apps Script:** [developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Comunidad:** [Stack Overflow - google-apps-script](https://stackoverflow.com/questions/tagged/google-apps-script)
- **Videos:** Busca "Google Apps Script Gmail" en YouTube

---

## ✅ Checklist de Instalación

- [ ] Código copiado en Apps Script
- [ ] Permisos autorizados
- [ ] CRM actualizado por primera vez
- [ ] Dashboard visible
- [ ] Métricas correctas
- [ ] Enlaces funcionando
- [ ] Configuración personalizada (opcional)

---

## 🎉 ¡Ya estás listo!

Tu CRM está configurado y funcionando. Ahora puedes:

1. **Monitorear** tus contactos automáticamente
2. **Priorizar** tu seguimiento
3. **Maximizar** tu tasa de respuesta
4. **Nunca perder** una oportunidad

---

**¿Preguntas? Revisa:**
- `CRM-MEJORAS-EXPLICACION.md` - Explicación detallada
- `CRM-FUNCIONALIDADES-AVANZADAS.js` - Funciones extra
- `google-sheets-crm-mejorado.js` - Código fuente

**¡Éxito con tu CRM! 🚀📧**
