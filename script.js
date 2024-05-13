import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';
const supabase = createClient('https://olezxgvjwaapmpvuuxhx.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9sZXp4Z3Zqd2FhcG1wdnV1eGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUyNjQ0ODEsImV4cCI6MjAzMDg0MDQ4MX0.QhebJQ6x66GSbZ9xK4LHU32R-zLAwdd_KCBYInZlfys');

async function fetchDataName(inputData) {
    const { data, error } = await supabase
        .from('People')
        .select()
        .ilike('Name', `%${inputData}%`);
    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        if (data.length === 0) {
            document.getElementById('message').innerText = 'No result found';
            return;
        }

        document.getElementById('message').innerText = 'Search successful';

        for (var i = 0; i < data.length; i++) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('searchresult');

            const columns = ['personid', 'name', 'address', 'dob', 'licensenumber', 'expirydate'];
            const columnsVars = ['PersonID', 'Name', 'Address', 'DOB', 'LicenseNumber', 'ExpiryDate'];
            columns.forEach((column, index) => {
                var element = data[i][columnsVars[index]];
                const p = document.createElement('p');
                p.innerHTML = `<strong>${column}: </strong>${element}`;
                newDiv.appendChild(p);
            });

            document.getElementById('results').appendChild(newDiv);
        }
    }
}

async function fetchDataLicense(inputData) {
    const { data, error } = await supabase
        .from('People')
        .select()
        .eq('LicenseNumber', `%${inputData}%`);
    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        if (data.length === 0) {
            document.getElementById('message').innerText = 'No result found';
            return;
        }

        document.getElementById('message').innerText = 'Search successful';

        for (var i = 0; i < data.length; i++) {
            const newDiv = document.createElement('div');
            newDiv.classList.add('searchresult');

            const columns = ['personid', 'name', 'address', 'dob', 'licensenumber', 'expirydate'];
            const columnsVars = ['PersonID', 'Name', 'Address', 'DOB', 'LicenseNumber', 'ExpiryDate'];
            columns.forEach((column, index) => {
                var element = data[i][columnsVars[index]];
                const p = document.createElement('p');
                p.innerHTML = `<strong>${column}: </strong>${element}`;
                newDiv.appendChild(p);
            });

            document.getElementById('results').appendChild(newDiv);
        }
    }
}

async function fetchDataRego(inputData) {
    const { data, error } = await supabase
        .from('Vehicles')
        .select()
        .eq('VehicleID', `${inputData}`);
    if (error) {
        console.error('Error fetching data:', error.message);
    } else {
        if (data.length === 0) {
            document.getElementById('message').innerText = 'No result found';
            return;
        }

        document.getElementById('message').innerText = 'Search successful';
        const newDiv = document.createElement('div');
        newDiv.classList.add('searchresult');

        const columns = ['vehicleid', 'make', 'model', 'colour', 'ownerid'];
        const columnsVars = ['VehicleID', 'Make', 'Model', 'Colour', 'OwnerID'];
        columns.forEach((column, index) => {
            var element = data[0][columnsVars[index]];
            const p = document.createElement('p');
            p.innerHTML = `<strong>${column}: </strong>${element}`;
            newDiv.appendChild(p);
        });

        const testVAR = data[0]['OwnerID'];
        const ownernamePromise = searchDatabase('Name', testVAR);
        const ownerlicensePromise = searchDatabase('LicenseNumber', testVAR);
        const ownername = await ownernamePromise;
        const ownerlicense = await ownerlicensePromise;
        const p = document.createElement('p');
        p.innerHTML = `<strong>ownername: </strong>${ownername}`;
        newDiv.appendChild(p);
        const d = document.createElement('p');
        d.innerHTML = `<strong>ownerlicensenumber: </strong>${ownerlicense}`;
        newDiv.appendChild(d);
        document.getElementById('results').appendChild(newDiv);
    }
}

async function searchDatabase(searchField, searchItem) {
    const { data, error } = await supabase
        .from('People')
        .select()
        .eq('PersonID', `${searchItem}`)
        .single();

    if (error) {
        console.error('Error fetching data:', error.message);
        return null;
    }
    const searchResult = data[searchField];
    return searchResult;
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('searchForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const searchResults = document.querySelectorAll('.searchresult');

            searchResults.forEach(element => {
                element.style.display = 'none';
            });

            var nameInput = document.getElementById('name').value.trim();
            var licenseInput = document.getElementById('license').value.trim();
            var messageDiv = document.getElementById('message');

            if (nameInput === '' && licenseInput === '') {
                messageDiv.textContent = 'Error, both fields empty';
            } else if (nameInput !== '' && licenseInput !== '') {
                messageDiv.textContent = 'Error, you can only search one attribute at a time';
            } else {
                if (nameInput !== '') {
                    fetchDataName(nameInput);
                } else {
                    fetchDataLicense(licenseInput);
                }
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', function() {
    var vehicleForm = document.getElementById('vehicleADDForm');
    if (vehicleForm) {
        vehicleForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const rego = document.getElementById('rego').value.trim();
            const make = document.getElementById('make').value.trim();
            const model = document.getElementById('model').value.trim();
            const colour = document.getElementById('colour').value.trim();
            const owner = document.getElementById('owner').value.trim();

            if (!rego || !make || !model || !colour) {
                document.getElementById('message').innerText = 'Error, please make sure all fields are filled in, or leave owner blank to add a new owner';
                return;
            } else {
                if (!owner) {
                    document.getElementById('message').innerText = 'Please fill this in to add a new owner';
                    document.getElementById('newOwnerForm').style.display = 'block';
                    return;
                } else {
                    const { data: ownerData, error } = await supabase
                        .from('People')
                        .select()
                        .eq('Name', owner);

                    if (error) {
                        console.error('Error checking owner:', error.message);
                        return;
                    }

                    if (ownerData.length === 0) {
                        document.getElementById('newOwnerForm').style.display = 'block';
                        document.getElementById('message').innerText = 'Error, owner entered does not exist, please enter a new owner';
                        return;
                    } else {
                        const { data, error } = await supabase
                        .from('Vehicles')
                        .select()
                        .eq('VehicleID', rego);
                        if (error) {
                            console.error('Error querying Vehicles table:', error.message);
                          } else {
                            if (data.length !== 0) 
                            {
                                document.getElementById('message').innerText = 'Error, a car with this registration already exists';
                            } 
                            else 
                            {
                                await addVehicle(rego, make, model, colour, ownerData[0]['PersonID']);
                                document.getElementById('message').innerText = 'Vehicle added successfully';
                                clearFormFields('vehicleADDForm');
                            }
                          }
                    }
                }
            }
        });
    }

    var ownerForm = document.getElementById('newOwnerForm');
    if (ownerForm) {
        ownerForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const personid = document.getElementById('personid').value.trim();
            const name = document.getElementById('name').value.trim();
            const address = document.getElementById('address').value.trim();
            const dob = document.getElementById('dob').value.trim();
            const license = document.getElementById('license').value.trim();
            const expire = document.getElementById('expire').value.trim();

            if (!name || !address || !dob || !license || !expire || !personid) {
                document.getElementById('message').innerText = 'Error, please make sure all fields are filled in';
                return;
            } else {
                const rego = document.getElementById('rego').value.trim();
                const make = document.getElementById('make').value.trim();
                const model = document.getElementById('model').value.trim();
                const colour = document.getElementById('colour').value.trim();
                if (!rego || !make || !model || !colour) {
                    document.getElementById('message').innerText = 'Error, please make sure all fields are filled in';
                    return;
                }
                const { data, error } = await supabase
                .from('People')
                .select()
                .eq('PersonID', personid);
                if (error) {
                console.error('Error querying Person table:', error.message);
                } 
                else 
                {
                if (data.length !== 0) 
                    {
                        document.getElementById('message').innerText = 'Error, a person with this ID already exists';
                    } 
                    else 
                    {
                        const { error } = await supabase
                        .from('People')
                        .insert([
                            {
                                PersonID: personid,
                                Name: name,
                                Address: address,
                                DOB: dob,
                                LicenseNumber: license,
                                ExpiryDate: expire
                            }
                        ]);
    
                        if (error)  {
                            console.error('Error adding owner:', error.message);
                            return;
                        }
                        await addVehicle(rego, make, model, colour, personid);
                        document.getElementById('message').innerText = 'Vehicle added successfully';
                        await clearFormFields('vehicleADDForm');
                        await clearFormFields('newOwnerForm');
                        document.getElementById('newOwnerForm').style.display = 'none';
                    }
                }
            }
        });
    }
});

async function addVehicle(rego, make, model, colour, ownerid) {
    const { error } = await supabase
        .from('Vehicles')
        .insert([
            {
                VehicleID: rego,
                Make: make,
                Model: model,
                Colour: colour,
                OwnerID: ownerid
            }
        ]);

    if (error) {
        console.error('Error adding vehicle:', error.message);
        return;
    }
}

function clearFormFields(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const inputFields = form.querySelectorAll('input, textarea, select');
        inputFields.forEach(field => {
            field.value = '';
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('searchForm2');
    if(form){
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const searchResults = document.querySelectorAll('.searchresult');

            searchResults.forEach(element => {
                element.style.display = 'none';
            });
            var regoInput = document.getElementById('rego').value.trim();
        
            var messageDiv = document.getElementById('message');
            
            if (regoInput === '') {
                messageDiv.textContent = 'Error, field empty';
            }
            else {
                fetchDataRego(regoInput);
            }
        });
    }
});
