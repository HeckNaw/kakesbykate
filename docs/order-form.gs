/**
 * Kakes by Kate — order + review form handler.
 *
 * Orders are logged to the "Orders" tab, inspo photos saved to Drive, the
 * customer emailed a copy, and Kate notified. Reviews (type:'review') are
 * logged to the "Reviews" tab and Kate is notified.
 *
 * Setup & deployment steps: see docs/order-form-google-sheet.md
 */

// ───────── Config ─────────
var KATE_EMAIL = 'kate@example.com'        // ← where new-order / review alerts go
var DRIVE_FOLDER_NAME = 'Kakes by Kate — Order Photos'
var SHEET_NAME = 'Orders'                   // ← orders tab
var REVIEW_SHEET_NAME = 'Reviews'           // ← reviews tab (auto-created)

// Columns written to the Orders tab, in order.
var HEADERS = [
  'Submitted', 'Product', 'Name', 'Email', 'Instagram / Facebook', 'Phone',
  'Pickup date', 'Pickup time',
  'Cake size', 'Cake flavour', 'Cake filling', 'Cake message', 'Cake description',
  'Cupcake qty', 'Cupcake flavour', 'Cupcake description',
  'Macaron qty', 'Macaron flavours', 'Macaron extras',
  'Other description', 'Photos',
]

// Columns written to the Reviews tab, in order.
var REVIEW_HEADERS = ['Submitted', 'Name', 'Rating (out of 5)', 'Feedback', 'Photos']

function doPost(e) {
  var data
  try {
    data = JSON.parse(e.postData.contents)
  } catch (err) {
    return json_({ ok: false, error: 'Bad request: ' + err })
  }

  // Reviews go to their own tab.
  if (data.type === 'review') {
    try {
      appendReview_(data)
    } catch (err) {
      return json_({ ok: false, error: 'Could not save review: ' + err })
    }
    try { emailKateReview_(data) } catch (err) { /* alert is non-critical */ }
    return json_({ ok: true })
  }

  // Photos and emails are best-effort — never let them lose the order itself.
  var photoLinks = []
  try { photoLinks = savePhotos_(data) } catch (err) { photoLinks = ['(photos failed: ' + err + ')'] }

  try {
    appendRow_(data, photoLinks)
  } catch (err) {
    return json_({ ok: false, error: 'Could not save order: ' + err })
  }

  try { emailCustomer_(data) } catch (err) { /* customer copy is non-critical */ }
  try { emailKate_(data, photoLinks) } catch (err) { /* alert is non-critical */ }

  return json_({ ok: true })
}

// Append a review to the Reviews tab, creating it + headers on first run.
function appendReview_(d) {
  var photoLinks = []
  try { photoLinks = savePhotos_(d) } catch (err) { photoLinks = ['(photos failed: ' + err + ')'] }

  var ss = SpreadsheetApp.getActive()
  var sheet = ss.getSheetByName(REVIEW_SHEET_NAME) || ss.insertSheet(REVIEW_SHEET_NAME)
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(REVIEW_HEADERS)
    sheet.getRange(1, 1, 1, REVIEW_HEADERS.length).setFontWeight('bold')
  }
  sheet.appendRow([
    d.submittedAt || new Date().toISOString(),
    d.name || '',
    d.rating || '',
    d.feedback || '',
    photoLinks.join('\n'),
  ])
}

function emailKateReview_(d) {
  var subject = 'New review: ' + (d.rating || '?') + '/5 from ' + (d.name || 'a customer')
  GmailApp.sendEmail(
    KATE_EMAIL,
    subject,
    'Rating: ' + (d.rating || '') + '/5\nName: ' + (d.name || '') + '\n\n' + (d.feedback || ''),
    { name: 'Kakes by Kate Reviews' }
  )
}

// Append the order as a row, creating the header row on first run.
function appendRow_(d, photoLinks) {
  var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_NAME) ||
    SpreadsheetApp.getActive().insertSheet(SHEET_NAME)

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS)
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold')
  }

  sheet.appendRow([
    d.submittedAt || new Date().toISOString(),
    d.productType || '',
    d.name || '', d.email || '', d.instagram || '', d.phone || '',
    d.pickupDate || '', d.pickupTime || '',
    d.cakeSize || '', d.cakeFlavour || '', d.cakeFilling || '',
    d.cakeMessage || '', d.cakeDescription || '',
    d.cupcakeQuantity || '', d.cupcakeFlavour || '', d.cupcakeDescription || '',
    d.macaronQuantity || '', d.macaronFlavours || '', d.macaronExtras || '',
    d.otherDescription || '',
    photoLinks.join('\n'),
  ])
}

// Save base64 photos to a Drive folder; return shareable links.
function savePhotos_(d) {
  var links = []
  if (!d.photos || !d.photos.length) return links

  var folder = getFolder_(DRIVE_FOLDER_NAME)
  var stamp = (d.name || 'order').replace(/[^\w]+/g, '-')

  d.photos.forEach(function (p, i) {
    try {
      var parts = String(p.dataUrl).split(',')
      var bytes = Utilities.base64Decode(parts[1])
      var blob = Utilities.newBlob(bytes, p.type || 'image/jpeg',
        stamp + '-' + (i + 1) + '-' + (p.name || 'photo'))
      var file = folder.createFile(blob)
      file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW)
      links.push(file.getUrl())
    } catch (err) {
      links.push('(photo ' + (i + 1) + ' failed: ' + err + ')')
    }
  })
  return links
}

function getFolder_(name) {
  var existing = DriveApp.getFoldersByName(name)
  return existing.hasNext() ? existing.next() : DriveApp.createFolder(name)
}

// Email the customer a copy of their order.
function emailCustomer_(d) {
  if (!d.email) return
  var subject = 'Your Kakes by Kate order request 🍰'
  GmailApp.sendEmail(d.email, subject, summaryText_(d, false), {
    name: 'Kakes by Kate',
    htmlBody: summaryHtml_(d, false),
  })
}

// Notify Kate of the new order.
function emailKate_(d, photoLinks) {
  var subject = 'New order: ' + (d.productType || '?') + ' — ' + (d.name || '')
  GmailApp.sendEmail(KATE_EMAIL, subject, summaryText_(d, true), {
    name: 'Kakes by Kate Orders',
    htmlBody: summaryHtml_(d, true) +
      (photoLinks.length ? '<p><strong>Photos:</strong><br>' +
        photoLinks.map(function (l) { return '<a href="' + l + '">' + l + '</a>' }).join('<br>') +
        '</p>' : ''),
    replyTo: d.email || undefined,
  })
}

// Build the list of relevant fields for the chosen product.
function summaryRows_(d) {
  var rows = [
    ['Name', d.name], ['Pickup date', d.pickupDate], ['Pickup time', d.pickupTime],
    ['Instagram / Facebook', d.instagram], ['Phone', d.phone], ['Email', d.email],
  ]
  if (d.productType === 'cake') {
    rows.push(['Product', 'Cake'], ['Size', d.cakeSize], ['Flavour', d.cakeFlavour],
      ['Filling', d.cakeFilling], ['Message', d.cakeMessage], ['Description', d.cakeDescription])
  } else if (d.productType === 'cupcake') {
    rows.push(['Product', 'Cupcakes'], ['Quantity', d.cupcakeQuantity],
      ['Flavour', d.cupcakeFlavour], ['Description', d.cupcakeDescription])
  } else if (d.productType === 'macarons') {
    rows.push(['Product', 'Macarons ($24/dozen)'], ['Quantity', d.macaronQuantity],
      ['Flavours', d.macaronFlavours], ['Extra requests', d.macaronExtras])
  } else {
    rows.push(['Product', 'Other'], ['Request', d.otherDescription])
  }
  return rows.filter(function (r) { return r[1] })
}

function summaryText_(d, forKate) {
  var intro = forKate ? 'New order request:\n\n'
    : 'Thanks ' + (d.name || '') + '! Here’s a copy of your order request:\n\n'
  var body = summaryRows_(d).map(function (r) { return r[0] + ': ' + r[1] }).join('\n')
  var outro = forKate ? '' :
    '\n\n' + (d.productType === 'macarons'
      ? 'Macarons are a set price of $24 per dozen. You’ll receive confirmation and pickup + payment details within 48 hours.'
      : 'You’ll receive an order quote within 48 hours via Instagram or email, then your pickup address and payment options.') +
    '\n\nThank you! — Kate'
  return intro + body + outro
}

function summaryHtml_(d, forKate) {
  var rows = summaryRows_(d).map(function (r) {
    return '<tr><td style="padding:4px 12px 4px 0;color:#a8404f;font-weight:600;">' +
      r[0] + '</td><td style="padding:4px 0;">' + r[1] + '</td></tr>'
  }).join('')
  var intro = forKate ? '<p>New order request:</p>'
    : '<p>Thanks ' + (d.name || '') + '! Here’s a copy of your order request:</p>'
  var outro = forKate ? '' : '<p style="color:#6b3f49;">' +
    (d.productType === 'macarons'
      ? 'Macarons are a set price of <strong>$24 per dozen.</strong> You’ll receive confirmation and pickup + payment details within 48 hours.'
      : 'You’ll receive an order quote within 48 hours via Instagram or email, then your pickup address and payment options.') +
    '</p><p>Thank you! — Kate 💕</p>'
  return '<div style="font-family:sans-serif;color:#3a1a23;">' + intro +
    '<table style="border-collapse:collapse;">' + rows + '</table>' + outro + '</div>'
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
}
