const project = new URLSearchParams(window.location.search).get("p")

const title = document.getElementById("title")
const description = document.getElementById("description")
const image = document.getElementById("image")

function main() {
    fetchInfo().then(info => loadElements(info))
}

function loadElements(info) {
    document.title = info.title
    title.innerHTML = applyTags(info.title)
    description.innerHTML = applyTags(info.description)

    image.src = `/projects/${project}/main.webp`
    loadLabels()
}

async function fetchInfo() {
    return (await fetch(`/projects/${project}/info.json`)).json()
}

async function loadLabels() {
    const svg = document.getElementById("labels").children
        ; (await fetch(`/projects/${project}/labels.json`)).json().then(json => {
            const labels = json.labels

            for (let i = 0; i < labels.length; i++) {
                const label = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "use"
                )
                label.setAttribute("href", `${labels[i]}-label.svg#${labels[i]}`)
                svg[i].appendChild(label)
            }
        })
}

function applyTags(text) {
    //Paragraphs
    text = text.replace(/\n/g, "<br><br>")
    const subsString = text.match(/<c (.*?)<\/c>/g)
    subsString?.forEach(s => {
        const color = s.slice(3, s.indexOf(">"))
        const content = s.slice(4 + color.length, s.length - 4)
        const newHTML = `<span style="color:${color}">${content}</span>`
        text = text.replace(s, newHTML)
    })

    return text
}

main()
