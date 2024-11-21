const thumbnails = Array.from(document.getElementsByClassName("thumbnail")) as HTMLImageElement[]

function main() {
    for (let i = 0; i < thumbnails.length; i++) {
        thumbnails[i].onmouseover = () => onThumbnailMouseOver(i)
        thumbnails[i].onmouseleave = () => onThumbnailMouseLeave(i)
    }
}

function onThumbnailMouseOver(index: number) {
    const sizeFactor = thumbnails[index].width / 400;

    let leftSiblings = getLeftSiblings(index)
    for (let i = 0; i < leftSiblings.length; i++) {
        const falloff = sizeFactor / Math.pow(i + 1, 1.05)
        leftSiblings[i].style.transform = "translateX(-" + falloff + "em)"
        leftSiblings[i].style.transition = "transform 50ms ease-out"
    }

    let rightSiblings = getRightSiblings(index)
    for (let i = 0; i < rightSiblings.length; i++) {
        const falloff = sizeFactor / Math.pow(i + 1, 1.05)
        rightSiblings[i].style.transform = "translateX(" + falloff + "em)"
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
main()