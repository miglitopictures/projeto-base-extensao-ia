function typewrite(element, text, delay=10, i=0){
    if (i === 0){
        element.textContent = ''
    }
    element.textContent += text[i]
    if (i === text.length - 1){
        return
    }
    setTimeout(() => typewrite(element, text, delay, i+1),delay)
}