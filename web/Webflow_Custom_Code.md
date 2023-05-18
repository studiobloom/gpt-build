<script defer src="https://cdn.jsdelivr.net/npm/@finsweet/attributes-copyclip@1/copyclip.js"></script>
<script>
const form = document.querySelector('#wf-form-generator');
const resultWrap = document.querySelector('#statement-component');
const resultLoader = document.querySelector('#statement-loader');
const resultText = document.querySelector('#statement-text');
form.addEventListener('submit', (event) => {
    event.preventDefault();
    resultWrap.style.display = "block";
    resultLoader.style.display = "flex";
    resultWrap.scrollIntoView({behavior: "smooth"});
    // FIELDS CAN BE CUSTOMIZED/ADDED BUT TAGS ON WEBFLOW ELEMENTS AND INDEX.JS SERVER FILE MUST BE MODIFIED
    const name = document.getElementById('name').value;
    const location = document.getElementById('location').value;
    const birthdate = document.getElementById('birthdate').value;
    const question = document.getElementById('question').value;
    // REPLACE API URL WITH YOUR DOMAIN/API
    const apiGatewayUrl = 'https://your-domain.com/api';
    fetch(apiGatewayUrl, {
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, location, birthdate, question }) // MUST CHANGE IF FORMS ARE MODIFIED
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(result => {
        console.log(result);
        const assistantMessage = result.choices[0].message.content;
        resultText.innerText = assistantMessage;
        resultLoader.style.display = "none";
    })
    .catch(e => {
        console.log('There was a problem with the fetch operation: ' + e.message);
    });
});
</script>