export default class Background {
    // this could be improved, we basically create a really long gradient on every click and change it a bit
    // so it gives an illusion that its slowly changing 
    static updateBackground = (n) => {
        let color = "linear-gradient(180deg, "
        for(let i = 0; i < 11; i++ ) {
            color += `hsl(${(n - (i)*3)%360}, 100%, 80%) ${i * 10}%, `
        }
        color = color.substring(0, color.length - 2) + ")"
        document.body.style.background = color
    }
}