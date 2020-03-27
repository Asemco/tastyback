var crypto = require('crypto')
var mysql = require('../mysql-helper')

let form = {
    id: Number,
    first_name: String,
    last_name: String,
    email: String,
    phone_number: String,
    financial_institution: String,
    reason: String,
    status: String,
    timestamp: String
}

form.submitForm = async (assistForm) => {    

    form.first_name = assistForm.first_name;
    form.last_name = assistForm.last_name;
    form.email = assistForm.email;
    form.phone_number = assistForm.phone_number;
    form.financial_institution = assistForm.financial_institution;
    form.reason = assistForm.reason;
    form.status = "Freshly Submitted";

    let check = form.validateForm();

    if (!check[0])
        return check;
        
    result = await form.insertForm(form);
    if (!result[0] || result[1].length == 0)
        return [false, "Form has failed to be submitted.  Please contact info@smartsaver.org with the code: FI22E"];

    return [true, "Form has been submitted successfully!"];
}

form.validateForm = () => {

    if (form.first_name.length < 2 || form.first_name.length > 30)
      return [false, "First Name is invalid.  Must be between 2-30 characters."];
    if (form.last_name.length < 2 || form.last_name.length > 30)
      return [false, "Last Name is invalid.  Must be between 2-30 characters."];
    if (form.email.length < 5 || form.email.length > 50)
      return [false, "Email Name is invalid.  Must be between 5-50 characters."];
    if (form.phone_number.length < 0 || form.phone_number.length > 20)
      return [false, "The Phone Number entered is invalid.  Must be between 0-20 characters."];
    if (form.financial_institution.length < 2 || form.financial_institution.length > 50)
      return [false, "Financial Institution is invalid.  Must be between 2-50 characters."];
    if (form.reason.length < 2 || form.reason.length > 255)
      return [false, "Reason is invalid.  Must be between 2-255 characters."];
    
    return [true, "The form is Valid!"];
  }

form.getForms = async () =>  {
    try {
        let results = await mysql.runQuery('SELECT * FROM smartassist', )
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to select a form! |";
        console.log(err, excep);
        return [false, err];
    }
}

form.getFormByEmail = async (email) =>  {
    try {
        let results = await mysql.runQuery('SELECT * FROM smartassist WHERE email = ?', email)
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to select a form! |";
        console.log(err, excep);
        return [false, err];
    }
}

form.insertForm = async () =>  {
    try {
        let results = await mysql.runQuery('INSERT INTO smartassist (first_name, last_name, email, phone_number, financial_institution, reason, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [
                form.first_name,
                form.last_name,
                form.email,
                form.phone_number,
                form.financial_institution,
                form.reason,
                form.status]
        );
        if (results.length == 0)
            return [false, results];
        return [true, results];
    } catch (excep) {
        let err = "Failed to insert the form! |";
        console.log(err, excep);
        return [false, err];
    }
}

form.updateStatus = async (id, status) =>  {
    try {
        let results = await mysql.runQuery('UPDATE smartassist SET status = ? WHERE id = ?', [status, id])
        if (results.affectedRows == 0)
            return [false, results]
        return [true, results]
    } catch (excep) {
        let err = "Failed to update the status of the form! |";
        console.log(err, excep);
        return [false, err];
    }
}

module.exports = form