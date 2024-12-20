const labels = Array.from(document.getElementsByClassName("label")) as SVGElement[]
const gradient = document.getElementById("gradient") as HTMLElement
const thumbnails = Array.from(document.getElementsByClassName("thumbnail")) as HTMLImageElement[]
const searchTagActive = [false, false, false]   //Programming, 3D model, digital art

function main() {
    window.addEventListener("scroll", onScroll, { passive: true })
    //Set initial opacity
    onScroll();

    for (let i = 0; i < labels.length; i++) {
        labels[i].onclick = () => onLabelClick(i)
        labels[i].onmouseover = () => onLabelMouseOver(i)
        labels[i].onmouseleave = () => onLabelMouseLeave(i)
        onLabelClick(i)
    }
    for (let i = 0; i < thumbnails.length; i++) {
        addLabelsToThumbnail(i)

        thumbnails[i].onclick = () => onThumbnailClick(i)
        thumbnails[i].onmouseover = () => onThumbnailMouseOver(i)
        thumbnails[i].onmouseleave = () => onThumbnailMouseLeave(i)
    }
    gradient.onclick = () => onGradientMouseClick()
}

function onScroll() {
    const rect = gradient.getBoundingClientRect()
    gradient.style.opacity = `${(rect.bottom / 10) + 1}%`
}

function onLabelClick(index: number) {
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

function onLabelMouseOver(index: number) {

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

function onLabelMouseLeave(index: number) {
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

async function addLabelsToThumbnail(thumbnailIndex: number) {
    (await fetch(`/projects/${thumbnails[thumbnailIndex].id}/labels.json`)).json().then((json) => {
        const projectLabels = (json as ProjectLabels).labels

        for (let i = 0; i < projectLabels.length; i++) {
            let num = 0

            switch (projectLabels[i]) {
                case "programming":
                    labels[0].addEventListener("click", () => updateLabelCount(thumbnailIndex, 0))
                    if (searchTagActive[0])
                        num = 1
                    break;
                case "3d-model":
                    labels[1].addEventListener("click", () => updateLabelCount(thumbnailIndex, 1))
                    if (searchTagActive[1])
                        num = 1
                    break;
                case "digital-art":
                    labels[2].addEventListener("click", () => updateLabelCount(thumbnailIndex, 2))
                    if (searchTagActive[2])
                        num = 1
                    break;
                default:
                    console.error(`${thumbnails[thumbnailIndex].id}'s label "${projectLabels[i]}" is not valid. Check it's spelling.`)
                    break;
            }
            thumbnails[thumbnailIndex].dataset.labelCount = `${Number(thumbnails[thumbnailIndex].dataset.labelCount) + 1}`
        }
    })
}

function updateLabelCount(thumbnailIndex: number, labelIndex: number) {
    const labelCount = Number(thumbnails[thumbnailIndex].dataset.labelCount)
    if (searchTagActive[labelIndex])
        thumbnails[thumbnailIndex].dataset.labelCount = `${labelCount + 1}`
    else
        thumbnails[thumbnailIndex].dataset.labelCount = `${labelCount - 1}`

    if (thumbnails[thumbnailIndex].dataset.labelCount == '0')
        hideThumbnail(thumbnailIndex)
    else
        showThumbnail(thumbnailIndex)
}

function hideThumbnail(index: number) {
    thumbnails[index].style.display = "none"
}

function showThumbnail(index: number) {
    thumbnails[index].style.display = "block"
}

function onThumbnailClick(index: number) {
    const project = thumbnails[index].id
    window.open(`/page/page.html?p=${project}`)
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

function getLeftSiblings(index: number): HTMLImageElement[] {
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

function getRightSiblings(index: number): HTMLImageElement[] {
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

function hasLeftSibling(index: number): boolean {
    if (!thumbnails[index - 1])
        return false;
    return thumbnails[index - 1].getBoundingClientRect().right < thumbnails[index].getBoundingClientRect().left
        && thumbnails[index].getBoundingClientRect().bottom - thumbnails[index - 1].getBoundingClientRect().bottom < 400
}

function hasRightSibling(index: number): boolean {
    if (!thumbnails[index + 1])
        return false;
    return thumbnails[index + 1].getBoundingClientRect().x > thumbnails[index].getBoundingClientRect().x
        && thumbnails[index + 1].getBoundingClientRect().y - thumbnails[index].getBoundingClientRect().y < 400
}

interface ProjectLabels {
    labels: Array<string>
}

main()