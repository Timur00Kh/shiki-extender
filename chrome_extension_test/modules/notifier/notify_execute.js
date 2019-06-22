(function () {
    let button = document.createElement('a');
    button.className ='b-link_button dark watch-online';
    button.innerText = 'Уведомить';
    // button
    button.style.marginTop = '20px';

    let div = document.createElement('div');
    div.className = 'block';
    div.style.maxWidth = '80%';
    div.style.marginLeft = '10%';
    div.append(button);

    document.querySelector('.c-videos').append(div);


})();