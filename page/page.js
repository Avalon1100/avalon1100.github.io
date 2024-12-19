const project = new URLSearchParams(window.location.search).get("p")

const title = document.getElementById("title")
const description = document.getElementById("description")
const image = document.getElementById("image")

function main() {
    fetchInfo().then(info => loadElements(info))
}

function loadElements(info) {
    document.title = info.title
    title.textContent = info.title
    description.innerHTML = info.description.replace(
        new RegExp("\n", "g"),
        "<br><br>"
    )

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

main()
