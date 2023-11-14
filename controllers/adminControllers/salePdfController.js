const exceljs = require('exceljs');

const ordercollection = require('../../models/orderdb');


const sale_report = async (req, res) => {

    try {
        const orderData = await ordercollection.find();
        let productname =[]
        let price =[]
        let quantity = []
        let date = []
        let address = []
        orderData.forEach(val=>{
            productname.push(...val.itemsname);
            price.push(...val.subtotal);
            quantity.push(...val.quantity);      
            let len = val.quantity.length;
            for (let i = 0; i < len; i++) {
                  address.push(val.shippingAddress??"null");
                  date.push(val.created_at??"null");
            }      
        })
        console.log(date);
        const salesData = productname.map((value, index) => ({
            product: value,
            price: price[index],
            quantity: quantity[index],
            date: date[index],
            address: address[index]
        }));
        // const salesData = [
        //     { date: '2023-01-01', product: 'Product A', quantity: 10, price: 20 },
        //     { date: '2023-01-02', product: 'Product B', quantity: 15, price: 25 },
        // ];
        // Create a new workbook and add a worksheet
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Sales Report');
    
        // Define columns and headers
        worksheet.columns = [
            { header: 'Date', key: 'date', width: 15 },
            { header: 'Product', key: 'product', width: 30 },
            { header: 'Quantity', key: 'quantity', width: 15 },
            { header: 'Price', key: 'price', width: 15 },
            { header: 'Address', key: 'address', width: 30 }, 
        ];
    
        // Add data to the worksheet
        salesData.forEach((sale) => {
            worksheet.addRow(sale);
        });
    
        // Set up response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=sales-report.xlsx');
    
        // Write the workbook to the response
        workbook.xlsx.write(res)
            .then(() => {
                res.end();
            })
            .catch((error) => {
                console.error('Error generating Excel sales report:', error.message);
                res.status(500).send('Error generating Excel sales report');
            });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports ={
    sale_report
}