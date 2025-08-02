// src/routes/api/plugins/+server.ts
import type { RequestHandler } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { json, error } from '@sveltejs/kit';
import { sessionStore } from '$lib/server/store';
import {
  getPlugin
} from '$lib/addons/registry.server';

let token: string = '';
let administration_id: string = '';
let uri: string = '';

export const POST: RequestHandler = async ({ request }) => {
  // Parse headers
  const headers = request.headers;

  // 1) Grab all of your sessions from the in-memory store
  const sessions = Array.from(sessionStore.values());

  // 2) For each session, if it's fedex-web, call the async helper
  for (const session of sessions) {
    if (session.pluginName === 'moneybird-api') {
      token = session.auth.token;
      administration_id = session.auth.administration_id;
    }
    if (session.pluginName === 'mongodb') {
      uri = session.auth.uri;
    }
  }

  // 1. Grab all uploaded CSVs from the multipart/form-data POST
  const form = await request.formData();
  const uploads = form.getAll('files');

  if (!uploads.length) {
    throw error(400, 'No files uploaded');
  }

    const results = [];
  for (const fileCandidate of uploads) {
    if (!(fileCandidate instanceof File)) {
      // skip any non-File entries
      continue;
    }

    const file = fileCandidate;
    const text = await file.text();
    const jsonData = csvToJson(text);

        if (headers.has('addon') && headers.get('addon') === 'mongodb') {
          //console.log("mongodb data: ", jsonData);
          const plugin = getPlugin('mongodb').init();
          const db = await plugin.dbAuth(uri);
          results.push(await runDB(jsonData, db, plugin));
        }

    if (headers.has('addon') && headers.get('addon') === 'moneybird-api') {
    const mappedInvoiceData = mapFields(jsonData);
    // console.log("mappedInvoiceData: ", mappedInvoiceData);
    const plugin = getPlugin('moneybird-api').init();

    for (const mappedInvoice of mappedInvoiceData) {
          const parsedInvoice = await plugin.mapPurchaseInvoiceData(mappedInvoice, token, administration_id, true);
        results.push(await plugin.createPurchaseInvoice(parsedInvoice.data, administration_id, token));
    }
}

  }

  // 4. Return the parsed data
  return json({
    success: true,
    files: results
  });
};


async function runDB(manifest: any, db: any, plugin: any) {
// 1) Your incoming “manifest” array of JSON objects:

let skipped = [];
let updated = [];
  await plugin.dbCon(db);
// 2) Iterate and process each item:
for (const item of manifest){
  // Parse the IDs & amounts into numbers
  const orderId = parseInt(item.referentie_1_verzender, 10);
  const tnt     = item.luchtvrachtbriefnummer;
  const cost    = parseFloat(item.totale_bedrag_luchtvrachtbrief);
  const method  = item.svcpkg_label;
  const weight  = parseFloat(item.nominaal_gewichtaantal);



  // 3) Find the order
  const order = await(plugin.dbRead(db, 'InstantPack', 'order_data_test', { ext_cdk_order_id: orderId }, null));
  if (order.data.length === 0) {
    skipped.push(tnt);
    continue;
  }
updated.push(tnt);
  // 4) Check if that shipment exists
  const exists = Array.isArray(order.data[0].order_shipment) &&
                 order.data[0].order_shipment.some(s => s.ship_tnt_number === tnt);
// console.log("exists (" + orderId + "): ", exists);
  if (exists) {
    // 4a) Update existing shipment
    const update_result = await(plugin.dbUpdate(db, 'InstantPack', 'order_data_test', { ext_cdk_order_id: orderId, "order_shipment.ship_tnt_number": tnt }, { $set: { "order_shipment.$.ship_cost": cost, "order_shipment.$.ship_cost_ready": true, "order_shipment.$ship_weight": weight } }));
  } else {
    // 4b) Push a new shipment sub‐document
    const update_result = await(plugin.dbUpdate(db, 'InstantPack', 'order_data_test', { ext_cdk_order_id: orderId }, { $push: { order_shipment: { ext_cdk_order_id: orderId, ship_tnt_number: tnt, ship_cost: cost, ship_cost_ready: true, ship_method_oid: '67f12db0ee72fad72422e94a', ship_method: method, ship_tnt_url: `https://www.fedex.com/fedextrack/?trknbr=${tnt}`, ship_carrier: "FEDEX", ship_parcel_type: "PARCEL", ship_date: new Date, ship_label_providor: "SENDCLOUD", ship_weight: weight} } }));
  }
};
  await plugin.dbCls();
  
// 5) Report any that had no matching order
return {
  skipped: skipped,
  updated: updated};

}


/**
 * Parse a CSV string into an array of objects, correctly handling
 * quoted fields and stripping their wrapping quotes.
 *
 * @param {string} csv     The raw CSV text
 * @param {string} [sep]   Field delimiter (default: comma)
 * @returns {Object[]}
 */
function csvToJson(csv, sep = ',') {
  const splitter = new RegExp(`${sep}(?=(?:[^"]*"[^"]*")*[^"]*$)`);
  const lines    = csv.trim().split(/\r?\n/);

  // 1) pull off header row, strip quotes, then replace spaces/hyphens with underscores
  const headers = lines
    .shift()!
    .split(splitter)
    .map(h =>
      h
        .trim()
        .replace(/^"(.*)"$/, '$1')    // strip wrapping quotes
        .replace(/[\s\-\\/]+/g, '_')        // spaces or hyphens → _
        .toLowerCase()                    // lowercase
    );

  // 2) parse each data row the same way (strip quotes)
  const rows = lines.map(line =>
    line.split(splitter).map(cell =>
      cell.trim().replace(/^"(.*)"$/, '$1')
    )
  );

  // 3) zip headers → values
  return rows.map(values => {
    const obj: Record<string, string> = {};
    headers.forEach((key, i) => {
      obj[key] = values[i] ?? '';
    });
    return obj;
  });
}


function mapFields(invoiceData) {
  // 

const purchaseInvoices = [];

  // First group the data by invoice number
  const groupedData = invoiceData.reduce((acc, curr) => {
    const invoiceNumber = curr["fedex_factuurnummer"];
    if (!acc[invoiceNumber]) {
      acc[invoiceNumber] = [];
    }
    acc[invoiceNumber].push(curr);
    return acc;
  }, {});

  // Loop through the grouped data and create the purchase invoice object
  // console.log("groupedData: ", groupedData);
  for (const invoiceNumber in groupedData) {
    const invoiceData = groupedData[invoiceNumber];
    const purchaseInvoice = {
      invoice_from: "",
      invoice_type: "",
      invoice_client_name: "",
      invoice_client_company: "",
      invoice_client_billing_auto: false,
      invoice_client_billing_period: "",
      invoice_reference: "",
      invoice_date: "",
      invoice_due_date: "",
      invoice_items: []
    };


    purchaseInvoice.invoice_from = "FedEx Express Netherlands B.V.";
    purchaseInvoice.invoice_type = "purchase_invoice";
    purchaseInvoice.invoice_client_name = "Elwin Hammer";
    purchaseInvoice.invoice_client_company = "InstantPack V.O.F.";
    purchaseInvoice.invoice_client_billing_auto = false;
    purchaseInvoice.invoice_client_billing_period = "";
    purchaseInvoice.invoice_reference = invoiceData[0]["fedex_factuurnummer"];
    purchaseInvoice.invoice_date = invoiceData[0]["factuurdatum"];
    purchaseInvoice.invoice_due_date = invoiceData[0]["vervaldatum"];
    purchaseInvoice.invoice_items = invoiceData.map((item) => ({
      item_description: item["bedrijfsnaam_afzender"] + " - " + item["type_factuur"]+ " - " + item["svcpkg_label"] + " - " + item["land_gebied_adres_ontvanger"] + " - " + item["luchtvrachtbriefnummer"],
      item_quantity: 1,
      item_price: item["totale_bedrag_luchtvrachtbrief"],
      item_tax_rate: item["land_gebied_adres_ontvanger"] === "US" || item["land_gebied_adres_ontvanger"] === "CA" ? "Btw vrijgesteld" : "21% btw", // Btw vrijgesteld only when country is US or CA
      item_ledger_account: "Verzendkosten"
    }));

    purchaseInvoices.push(purchaseInvoice);
  }


return purchaseInvoices;
}

  // async function getConacts(){

  //         // 1) Narrow down the plugin
  //   const api = getPlugin('moneybird-api').init();
  
  //   // 2) Call the async getCookie method, passing in the auth object
  //   const result = await api.getContacts(undefined, '331380231366510357', "g7wLyOb-aWECDByU8roVDpfAwzSKhcctl93DSMxxW6w");
  
  //   // 3) Return whatever the plugin gives you
  //   return result;

  // }