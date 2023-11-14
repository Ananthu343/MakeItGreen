const PDFDocument = require('pdfkit');

const ordercollection = require('../models/orderdb');

const downloadInvoice = async (req, res) => {
    const orderId = req.params.id;
    generateAndDownloadInvoice(orderId, res);
};

const generateAndDownloadInvoice = async (orderId, res) => {
    try {
        // Fetch order details from the order collection
        const orderData = await ordercollection.findById(orderId);
        console.log(orderData);
        if (!orderData) {
            // Handle the case where the order is not found
            return res.status(404).send('Order not found');
        }

        // Extract relevant information from the orderData
        const payId = orderData.invoice.paymentId;
        const ordernum = orderData.invoice.orderId;
        const created_at = orderData.created_at;
        const address = orderData.shippingAddress;
        const products = orderData.itemsname.map((value, index) => ({
            name: value,
            price: orderData.subtotal[index],
            quantity: orderData.quantity[index],
        }));

        // Create PDF content
        const doc = new PDFDocument();

        // Set fonts
        doc.font('Helvetica-Bold').fontSize(18);

        // Add a header with centered text
        doc.text('Invoice', { align: 'center' });
        doc.moveDown();

        // Add details
        doc.font('Helvetica').fontSize(12);
        doc.text(`Invoice Number: ${ordernum}`);
        doc.text(`Payment Id: ${payId}`);
        doc.text(`Date: ${created_at}`);
        doc.moveDown();

        // Table header
        doc.text('Sl no.', 100, doc.y);
        doc.fillColor('black').text('Product', 200, doc.y, { width: 200 });
        doc.text('Quantity', 400, doc.y);
        doc.text('Price', 500, doc.y);

        doc.moveDown();

        // Table rows
        products.forEach((product,index) => {
            index ++;
            doc.text(index.toString(), 100, doc.y);
            doc.text(product.name, 200, doc.y, { width: 200 });
            doc.text(product.quantity.toString(), 400, doc.y);
            doc.text(product.price.toString(), 500, doc.y);
            doc.moveDown();
        });
        doc.moveDown();
        doc.fillColor('black').text(`Address : ${address}`, 100, doc.y, { width: 500 });
        // End the document
        doc.end();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=makeitgreen(invoice_${orderId}).pdf`);

        // Stream the PDF directly to the response
        doc.pipe(res);
    } catch (error) {
        console.error('Error generating or downloading invoice:', error.message);
        res.status(500).send('Error generating or downloading invoice');
    }
};



const saveinvoice = async (req,res) =>{
    console.log(req.body);
    const payId = req.body.paymentId;
    const orderId = req.body.order_id;
    const orderNum = req.body.orderNumber;
    const invoiceData = {
        paymentId : payId,
        orderId : orderId
    }
    try {
        await ordercollection.updateOne({orderid : orderNum},{$set:{invoice:invoiceData}});
    } catch (error) {
        console.log("error in savince invoide");
        console.log(error.message);
    }
}

module.exports = {
  saveinvoice,
  downloadInvoice,
}