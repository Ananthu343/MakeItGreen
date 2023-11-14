
const ordercollection = require('../../models/orderdb');

const adlogin = (req, res) => {
    if (req.session.admin) {
        res.redirect('/admin/dashboard')
    } else {
        res.render('adminlogin', { message: "" })
    }
}

const adloginpost = (req, res) => {
    const name = 'admin';
    const password = 1234
    if (name === req.body.name && password == req.body.password) {
        //adding session 
        req.session.admin = name;
        res.redirect('/admin/dashboard');
    } else {
        res.render('adminlogin', { message: 'invalid username or password :(' });
    }
}

const dashboard = async (req, res) => {
    try {
        const orderdata = await ordercollection.find();
        const dates = orderdata.map((element) => {
            return element.expectedBy;
        });
        let days = dates.map((element) => {
            const dateString = element;
            // Split the date string by "/"
            const dateParts = dateString.split("/");
            // Extract day, month, and year
            let day = parseInt(dateParts[0], 10);
            day = day - 5;
            if (day == 0) {
                day = 30;
            } else if (day == -1) {
                day = 29;
            } else if (day == -2) {
                day = 28;
            } else if (day == -3) {
                day = 27;
            } else if (day == -4) {
                day = 26;
            } else if (day == -5) {
                day = 25;
            }
            return day;
        })
        let months = dates.map((element) => {
            const dateString = element;
            // Split the date string by "/"
            const dateParts = dateString.split("/");
            // Extract day, month, and year
            const month = parseInt(dateParts[1], 10);
            return month;
        })
        let quantities = orderdata.map((element) => {
            if (element.status == "Delivered") {
                const sum = element.quantity.reduce((acc, val) => {
                    return acc + val;
                }, 0);
                return sum;
            } else {
                return 0;
            }
        });
        const result = days.reduce((accumulator, day, index) => {
            if (!accumulator.uniqueDays.includes(day)) {
                accumulator.uniqueDays.push(day);
                accumulator.sumQuantities.push(0);
            }
            const dayIndex = accumulator.uniqueDays.indexOf(day);
            accumulator.sumQuantities[dayIndex] += quantities[index];
            return accumulator;
        }, { uniqueDays: [], sumQuantities: [] });
        days = result.uniqueDays;
        sumQuantitiesPerDay = result.sumQuantities;

        const uniqueMonths = [];
        const sumQuantitiesPerMonth = [];

        months.forEach((month, index) => {
            if (!uniqueMonths.includes(month)) {
                uniqueMonths.push(month);
                sumQuantitiesPerMonth.push(0);
            }
            const monthIndex = uniqueMonths.indexOf(month);
            sumQuantitiesPerMonth[monthIndex] += quantities[index];
        });

        res.render('dashboard', { sumQuantitiesPerDay, days, uniqueMonths, sumQuantitiesPerMonth });
    } catch (error) {
        console.log("error in dashboard");
        console.log(error.message);
    }
};

const adlogout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/adminlogin");
    })
}

module.exports = {
    adloginpost,
    adlogin,
    adloginpost,
    adlogout,
    dashboard
}