// Tempel di Google Sheets > Extensions > Apps Script
const SHEET = "RSVP";
function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (sh.getLastRow() === 0) sh.appendRow(["Waktu", "Nama", "Kehadiran", "Ucapan"]);
  return sh;
}
function doPost(e) {
  const d = JSON.parse(e.postData.contents);
  getSheet_().appendRow([new Date(), d.nama, d.kehadiran, d.ucapan]);
  return ContentService.createTextOutput("ok");
}
function doGet() {
  const rows = getSheet_().getDataRange().getValues().slice(1)
    .map(r => ({ nama: r[1], kehadiran: r[2], ucapan: r[3] }));
  return ContentService.createTextOutput(JSON.stringify(rows)).setMimeType(ContentService.MimeType.JSON);
}
