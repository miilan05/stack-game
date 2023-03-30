export default class Background {
    static updateBackground = (n) => {
        let color = "linear-gradient(180deg, "
        for(let i = 0; i < 11; i++ ) {
            color += `hsl(${(n - (i)*3)%360}, 100%, 80%) ${i * 10}%, `
        }
        color = color.substring(0, color.length - 2) + ")"
        document.body.style.background = color
    }
}