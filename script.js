import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://olezxgvjwaapmpvuuxhx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZXp4Z3Zqd2FhcG1wdnV1eGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNjQ0ODEsImV4cCI6MjAzMDg0MDQ4MX0.QhebJQ6x66GSbZ9xK4LHU32R-zLAwdd_KCBYInZlfys');

document.addEventListener('DOMContentLoaded', function() {

    async function fetchDataName(inputData) {
        const { data, error } = await supabase
        .from('People')
        .select()
        .ilike('Name', `%${inputData}%`); // Fixed variable name here
        if (error) {
            console.error('Error fetching data:', error.message);
        }
        else{
            if (data.length === 0) {
                document.getElementById('message').innerText = 'No result found';
                return;
            }
    
            // Clear previous results
            document.getElementById('message').innerText = 'Search successful';
    
            // Iterate over each row in the data
            for (var i = 0; i < data.length; i++) {
                // Create a new div for each row
                const newDiv = document.createElement('div');
                newDiv.classList.add('searchresult');
            
                // Create paragraphs for each column
                const columns = ['personid', 'name', 'address', 'dob', 'licensenumber', 'expirydate'];
                const columnsVars = ['PersonID', 'Name', 'Address', 'DOB', 'LicenseNumber', 'ExpiryDate'];
                columns.forEach((column, index) => {
                    var element = data[i][columnsVars[index]]; // Access each attribute using bracket notation
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${column}: </strong>${element}`;
                    newDiv.appendChild(p);
                });
            
                // Append the new div to the results container
                document.getElementById('results').appendChild(newDiv);
            }
        }
    }
    async function fetchDataLicense(inputData) {
        const { data, error } = await supabase
        .from('People')
        .select()
        .eq('LicenseNumber', `%${inputData}%`); // Fixed variable name here
        if (error) {
            console.error('Error fetching data:', error.message);
        }
        else{
            if (data.length === 0) {
                document.getElementById('message').innerText = 'No result found';
                return;
            }
    
            // Clear previous results
            document.getElementById('message').innerText = 'Search successful';
    
            for (var i = 0; i < data.length; i++) {
                // Create a new div for each row
                const newDiv = document.createElement('div');
                newDiv.classList.add('searchresult');
            
                // Create paragraphs for each column
                const columns = ['personid', 'name', 'address', 'dob', 'licensenumber', 'expirydate'];
                const columnsVars = ['PersonID', 'Name', 'Address', 'DOB', 'LicenseNumber', 'ExpiryDate'];
                columns.forEach((column, index) => {
                    var element = data[i][columnsVars[index]]; // Access each attribute using bracket notation
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${column}: </strong>${element}`;
                    newDiv.appendChild(p);
                });
            
                // Append the new div to the results container
                document.getElementById('results').appendChild(newDiv);
            }
        }
    }

    async function fetchDataRego(inputData) {
        const { data, error } = await supabase
        .from('Vehicle')
        .select()
        .eq('VehicleID', `%${inputData}%`); // Fixed variable name here
        if (error) {
            console.error('Error fetching data:', error.message);
        }
        else{
            if (data.length === 0) {
                document.getElementById('message').innerText = 'No result found';
                return;
            }
    
            // Clear previous results
            document.getElementById('message').innerText = 'Search successful';
    
            for (var i = 0; i < data.length; i++) {
                // Create a new div for each row
                const { data2, error } = await supabase
                .from('People')
                .select()
                .eq('PersonID', data[i].OwnerID); // Fixed variable name here
                ownername = data2[0].Name;
                ownerlicense = data2[0].LicenseNumber;
                const newDiv = document.createElement('div');
                newDiv.classList.add('searchresult');
            
                // Create paragraphs for each column
                const columns = ['vehicleid', 'make', 'model', 'colour', 'ownerid'];
                const columnsVars = ['VehicleID', 'Make', 'Model', 'Colour', 'OwnerID'];
                columns.forEach((column, index) => {
                    var element = data[i][columnsVars[index]]; // Access each attribute using bracket notation
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${column}: </strong>${element}`;
                    newDiv.appendChild(p);
                });
                p.innerHTML = `<strong>ownername: </strong>${ownername}`;
                newDiv.appendChild(p);
                const p = document.createElement('p');
                p.innerHTML = `<strong>$ownerlicensenumber: </strong>${ownerlicense}`;
                newDiv.appendChild(p);
            
                // Append the new div to the results container
                document.getElementById('results').appendChild(newDiv);
            }
        }
    }

    document.getElementById('searchForm').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        
        const searchResults = document.querySelectorAll('.searchresult');

        // Loop through each element and set its display to 'none'
        searchResults.forEach(element => {
            element.style.display = 'none';
        });
        // Get input values
        var nameInput = document.getElementById('name').value.trim();
        var licenseInput = document.getElementById('license').value.trim();

        // Get message div
        var messageDiv = document.getElementById('message');
        
        // Check if both fields are empty
        if (nameInput === '' && licenseInput === '') {
            messageDiv.textContent = 'Error, both fields empty';
        }
        // Check if both fields are filled
        else if (nameInput !== '' && licenseInput !== '') {
            messageDiv.textContent = 'Error, you can only search one attribute at a time';
        }
        // Search database if only one input
        else {
            if (nameInput !== ''){
                fetchDataName(nameInput);
            }
            else {
                fetchDataLicense(licenseInput);
            }
        }
    });
    document.getElementById('searchForm2').addEventListener('submit', async function(e) {
        e.preventDefault(); // Prevent the default form submission behavior
        
        const searchResults = document.querySelectorAll('.searchresult');

        // Loop through each element and set its display to 'none'
        searchResults.forEach(element => {
            element.style.display = 'none';
        });
        // Get input values
        var regoInput = document.getElementById('rego').value.trim();

        // Get message div
        var messageDiv = document.getElementById('message');
        
        // Check if both fields are empty
        if (rego === '') {
            messageDiv.textContent = 'Error, field empty';
        }
        // Search database if only one input
        else {
            if (nameInput !== ''){
                fetchDataRego(regoInput);
            }
        }
    });
});
