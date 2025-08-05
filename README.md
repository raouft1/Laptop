# 🖥️ Computer Store - Google Sheets Backend

موقع ويب بسيط لعرض وفلترة منتجات الحواسيب، مع إمكانية إضافة منتجات جديدة مباشرة إلى **Google Sheets**.

## 🚀 الميزات:
- جلب وعرض المنتجات من Google Sheets.
- فلترة المنتجات حسب الصنف (Category).
- شريط بحث عن المنتجات.
- نموذج إضافة منتج جديد (اسم، سعر، وصف، صورة، صنف).
- كل البيانات محفوظة في Google Sheets.

## 🛠️ طريقة الاستخدام:

### 1️⃣ إعداد Google Sheets
1. أنشئ Google Sheet جديد.
2. أضف ورقة عمل باسم `Products`.
3. في الصف الأول، أضف العناوين التالية:
   - اسم المنتج
   - السعر
   - الوصف
   - رابط الصورة
   - الصنف

### 2️⃣ إعداد Google Apps Script (API)
1. من داخل Google Sheets، افتح **Extensions > Apps Script**.
2. الصق الكود التالي:

```javascript
function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  const rows = sheet.getDataRange().getValues();
  const headers = rows.shift();
  const products = rows.map(r => {
    let obj = {};
    headers.forEach((h, i) => obj[h] = r[i]);
    return obj;
  });
  return ContentService.createTextOutput(JSON.stringify(products))
                        .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Products");
  const data = JSON.parse(e.postData.contents);
  sheet.appendRow([data.name, data.price, data.desc, data.image, data.category]);
  return ContentService.createTextOutput("تمت إضافة المنتج").setMimeType(ContentService.MimeType.TEXT);
}
