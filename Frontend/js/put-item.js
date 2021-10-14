function putItem(data) {
    fetch('https://a0xtwzmka9.execute-api.us-east-2.amazonaws.com/items', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            window.alert(`Success: ${data}`);
        })
        .catch((error) => {
            console.error('Error:', error);
            window.alert(`Error: ${error}`);
        });

}
async function validateForm(e) {
    e.preventDefault();
    let block = form.elements['block'].value;
    let room = form.elements['room'].value;
    let full_occupancy = form.elements['full_occupancy'].value;
    let threshold = form.elements['threshold'].value;
    const data = {
        block: block,
        room: room,
        full_occupancy: full_occupancy,
        payload: '{"actual_occupancy": 0}',
        threshold: threshold,
    }
    putItem(data);
};