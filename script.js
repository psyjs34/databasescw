import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://olezxgvjwaapmpvuuxhx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZXp4Z3Zqd2FhcG1wdnV1eGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNjQ0ODEsImV4cCI6MjAzMDg0MDQ4MX0.QhebJQ6x66GSbZ9xK4LHU32R-zLAwdd_KCBYInZlfys');

document.addEventListener('DOMContentLoaded', function() {

    async function fetchDataName(inputData) {
        const { data, error } = await supabase
        .from('People')
        .select()
        .ilike('Name', inputData); // Fixed variable name here
        produceOutput(data);
    }
    async function fetchDataLicense(inputData) {
        const { data, error } = await supabase
        .from('People')
        .select()
        .ilike('LicenseNumber', inputData); // Fixed variable name here
        produceOutput(data);
    }

    async function produceOutput(data){
        if (error) {
            console.error('Error fetching data:', error.message);
            return;
        }
        else {
            if (data.length === 0) {
                document.getElementById('message').innerText = 'No result found';
                return;
            }
    
            // Clear previous results
            document.getElementById('message').innerText = 'Search successful';
    
            // Iterate over each row in the data
            data.forEach(row => {
                // Create a new div for each row
                const newDiv = document.createElement('div');
                newDiv.classList.add('box');
    
                // Create paragraphs for each column
                const columns = ['personid', 'name', 'address', 'dob', 'licensenumber', 'expirydate'];
                columns.forEach(column => {
                    const p = document.createElement('p');
                    p.innerHTML = `<strong>${column}: </strong>${row[column]}`;
                    newDiv.appendChild(p);
                });
    
                // Append the new div to the results container
                document.getElementById('results').appendChild(newDiv);
            });
        }
    }

    document.getElementById('searchForm').addEventListener('submit', async function(e) {
        event.preventDefault(); // Prevent the default form submission behavior
        
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
});
