// Deploy this file as a Google Apps Script Web app.
const SHEET_NAME = 'Khach moi';
const HEADERS = ['id', 'name', 'views', 'lastViewed', 'createdAt'];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET_NAME);
  if (!sh) sh = ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) sh.appendRow(HEADERS);
  return sh;
}

function output_(data, callback) {
  const json = JSON.stringify(data);
  if (callback && !/^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) callback = '';
  return callback
    ? ContentService.createTextOutput(callback + '(' + json + ');').setMimeType(ContentService.MimeType.JAVASCRIPT)
    : ContentService.createTextOutput(json).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const p = e.parameter || {};
  const sh = sheet_();
  if (p.action === 'view') {
    const guest = String(p.name || p.id || '').trim();
    if (guest) {
      const rows = sh.getDataRange().getValues();
      for (let i = 1; i < rows.length; i++) if (String(rows[i][0]) === guest || String(rows[i][1]).trim() === guest) {
        sh.getRange(i + 1, 3).setValue(Number(rows[i][2] || 0) + 1);
        sh.getRange(i + 1, 4).setValue(new Date());
        break;
      }
    }
    return output_({ok: true});
  }
  if (p.action === 'list') {
    const rows = sh.getDataRange().getValues().slice(1).filter(r => r[0]);
    const guests = rows.map(r => ({id: String(r[0]), name: String(r[1]), views: Number(r[2] || 0), lastViewed: r[3] ? new Date(r[3]).toLocaleString('vi-VN') : ''}));
    return output_({ok: true, guests}, p.callback);
  }
  return output_({ok: false, error: 'Action không hợp lệ.'}, p.callback);
}

function doPost(e) {
  const p = e.parameter || {};
  if (p.action !== 'add') return output_({ok: false, error: 'Action không hợp lệ.'});
  let guests = [];
  if (p.guests) {
    try { guests = JSON.parse(p.guests); } catch (err) { return output_({ok: false, error: 'Danh sách khách không đúng định dạng.'}); }
  } else if (p.id && p.name) {
    guests = [{id: p.id, name: p.name}];
  }
  guests = guests.map(g => ({id: String(g.id || '').trim(), name: String(g.name || '').trim().slice(0, 120)})).filter(g => g.id && g.name);
  if (!guests.length) return output_({ok: false, error: 'Hãy nhập ít nhất một tên khách.'});
  const sh = sheet_();
  const startRow = sh.getLastRow() + 1;
  const createdAt = new Date();
  const rows = guests.map(g => [g.id, g.name, 0, '', createdAt]);
  sh.getRange(startRow, 1, rows.length, HEADERS.length).setValues(rows);
  return output_({ok: true, added: rows.length});
}
