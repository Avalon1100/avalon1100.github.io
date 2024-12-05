const labels = Array.from(document.getElementsByClassName("label")) as SVGElement[]
const gradient = document.getElementById("gradient") as HTMLElement
const thumbnails = Array.from(document.getElementsByClassName("thumbnail")) as HTMLImageElement[]
const searchTagActive = [false, false, false]

function main() {
    window.addEventListener("scroll", onScroll, {passive: true})
    //Set initial opacity
    onScroll();

    for (let i = 0; i < labels.length; i++) {
        labels[i].onclick = () => onLabelClick(i)
        labels[i].onmouseover = () => onLabelMouseOver(i)
        labels[i].onmouseleave = () => onLabelMouseLeave(i)
        onLabelClick(i)
    }
    for (let i = 0; i < thumbnails.length; i++) {
        thumbnails[i].onmouseover = () => onThumbnailMouseOver(i)
        thumbnails[i].onmouseleave = () => onThumbnailMouseLeave(i)
    }
    gradient.onclick = () => onGradientMouseClick()
}

function onScroll() {
    const rect = gradient.getBoundingClientRect()
    gradient.style.opacity = `${(rect.bottom / 10) + 1}%`
}

function onLabelClick(index : number) {
    const colorEdge = labels[index].querySelector("#color-edge") as SVGElement;
    const text = labels[index].querySelector("#text") as SVGElement;
    
    //Activate
    if (!searchTagActive[index]) {
        colorEdge.style.translate = "0"
        colorEdge.style.fill = `var(--${labels[index].id})`
        colorEdge.style.transition = "all 300ms ease"
        labels[index].parentElement!.style.marginLeft = ".5em"
        
        text.style.fill = "var(--text)"
        text.style.transition = "all 300ms ease"
        
        searchTagActive[index] = true
    }
    //Deactivate
    else {
        colorEdge.style.translate = "10%"
        colorEdge.style.fill = "var(--inactive-label)"
        colorEdge.style.transition = "all 500ms ease"
        labels[index].parentElement!.style.marginLeft = "-.5em"
        
        text.style.fill = "var(--discrete-text)"
        text.style.transition = "all 500ms ease"
        
        searchTagActive[index] = false
    }
    refreshLabelColoredBorder();
}

function onLabelMouseOver(index : number) {
    
    if (searchTagActive[index]) {
        const colorEdge = labels[index].querySelector("#color-edge") as SVGElement
        colorEdge.style.translate = "-3%"
        colorEdge.style.transition = "all 300ms ease-out"
    }
    else {
        const text = labels[index].querySelector("#text") as SVGElement
        text.style.fill = "var(--text)"
        text.style.transition = "all 300ms ease-out"
    }
}

function onLabelMouseLeave(index : number) {
    const colorEdge = labels[index].querySelector("#color-edge") as SVGElement
    const text = labels[index].querySelector("#text") as SVGElement

    if (searchTagActive[index]) {
        colorEdge.style.translate = "0"
        colorEdge.style.transition = "all 500ms ease"
    }
    else {
        text.style.fill = "var(--discrete-text)"
        text.style.transition = "all 500ms ease"
    }
}

function onGradientMouseClick() {
    if (gradient.style.opacity > "0.5")
        window.scrollBy(0, window.innerHeight)
}

function onThumbnailMouseOver(index: number) {
    const sizeFactor = thumbnails[index].width / 400;

    let leftSiblings = getLeftSiblings(index)
    for (let i = 0; i < leftSiblings.length; i++) {
        const falloff = sizeFactor / Math.pow(i + 1, 1.05)
        leftSiblings[i].style.transform = `translateX(-${falloff}em)`
        leftSiblings[i].style.transition = "transform 50ms ease-out"
    }

    let rightSiblings = getRightSiblings(index)
    for (let i = 0; i < rightSiblings.length; i++) {
        const falloff = sizeFactor / Math.pow(i + 1, 1.05)
        rightSiblings[i].style.transform = `translateX(${falloff}em)`
        rightSiblings[i].style.transition = "transform 50ms ease-out"
    }
}

function onThumbnailMouseLeave(index: number) {
    getLeftSiblings(index).forEach(t => {
        t.style.transform = "translateX(0)"
        t.style.transition = "transform 100ms ease-out"
    });
    getRightSiblings(index).forEach(t => {
        t.style.transform = "translateX(0)"
        t.style.transition = "transform 100ms ease-out"
    });
}

function refreshLabelColoredBorder() {
    const labelsColoredBorder = document.getElementById("labels-colored-border") as HTMLElement
    const gradientColor = document.getElementById("gradient-color") as HTMLElement

    const colors: string[] = Array(labels.length)
    for (let i = 0; i < labels.length; i++) {
        if (searchTagActive[i])
            colors[i] = `var(--${labels[i].id})`
        else
            colors[i] = "transparent"
        
        labelsColoredBorder.style.setProperty(`--${labels[i].id}-gradient-color`, colors[i])
        gradientColor.style.setProperty(`--${labels[i].id}-gradient-color`, colors[i])
    }

    const transition = `--programming-label-gradient-color 500ms ease,
        --3d-model-label-gradient-color 500ms ease,
        --digital-art-label-gradient-color 500ms ease`

    labelsColoredBorder.style.transition = transition
    gradientColor.style.transition = transition
}

function getLeftSiblings(index: number) : HTMLImageElement[] {
    const arr: HTMLImageElement[] = []
    let j: number = 0
    for (let i = index; i > 0; i--) {
        if (hasLeftSibling(i))
            arr[j] = thumbnails[i - 1]
        else break;
        j++
    }
    return arr
}

function getRightSiblings(index: number) : HTMLImageElement[] {
    const arr: HTMLImageElement[] = []
    let j: number = 0
    for (let i = index; i < thumbnails.length; i++) {
        if (hasRightSibling(i))
            arr[j] = thumbnails[i + 1]
        else break;
        j++
    }
    return arr
}

function hasLeftSibling(index: number) : boolean {
    if (!thumbnails[index - 1])
        return false;
    return thumbnails[index - 1].getBoundingClientRect().x < thumbnails[index].getBoundingClientRect().x
    && thumbnails[index].getBoundingClientRect().y - thumbnails[index - 1].getBoundingClientRect().y < 400
}

function hasRightSibling(index: number) : boolean {
    if (!thumbnails[index + 1])
        return false;
    return thumbnails[index + 1].getBoundingClientRect().x > thumbnails[index].getBoundingClientRect().x
    && thumbnails[index + 1].getBoundingClientRect().y - thumbnails[index].getBoundingClientRect().y < 400
} 

function throttle(func: Function, timeFrame: number) {
    let lastTime : Date = new Date(0);
    return () => {
        const now = new Date();
        if ((now.getSeconds() - lastTime.getSeconds()) >= timeFrame) {
            func();
            lastTime = now;
        }
    };
}

main()