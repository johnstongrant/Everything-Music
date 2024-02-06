if (!sessionStorage.getItem("page")) {
    sessionStorage.setItem("page", "1")
}

if (!sessionStorage.getItem("filter")) {
    let filt = document.getElementById("filter").value;
    sessionStorage.setItem("filter",filt)
}

document.getElementById("filter").value = sessionStorage.getItem("filter");

document.addEventListener("click", async function(event) {
    if (event.target.matches(".like_button")) {
        if (validateForm()) {
            let toUpdate = event.target.id;
            const url = "/api/post";
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"id": toUpdate})
            });
            if (response.ok) {
                let btn;
                let btn_lst = document.getElementsByClassName("like_button");
                for (i = 0; i < btn_lst.length; i++) {
                    if (btn_lst[i].id === toUpdate) {
                        btn = btn_lst[i];
                        break;
                    }
                }
                let str = btn.innerHTML;
                let lst = str.split(":");
                let num = parseInt(lst[1]);
                num += 1;
                lst[1] = num;
                let fstr = lst.join(": ");
                btn.innerHTML = fstr;
            }
    
        }
    }
    else if (event.target.matches(".delete_button")) {
        if (validateForm()) {
            let id = event.target.id;
            const url = "/api/delete";
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({"id": id})
            })
            if (response.ok) {
                try {
                    let data = await response.json();
                    if (data["invalid"]) {
                        alert(data["invalid"])
                        window.location.href = data['redirect_path']
                    }

                }
                catch (error) {
                    document.getElementById(id).remove();

                }
            }
               
            }
        }
    else if (event.target.matches(".edit_button")) {
        if (validateForm()) {
            let id = event.target.id;            
            let form = document.createElement("form");
            form.action="/api/updatePost"
            form.method="post"
    
            var inputName = document.createElement('input');
            inputName.type = 'text';
            inputName.name = 'post_content';
            inputName.placeholder = 'retype your post';
            inputName.maxLength = 250;
    
            var inputID = document.createElement('input');
            inputID.type = 'text';
            inputID.name = 'id';
            inputID.value = id
            inputID.hidden = true;
    
            var buttonSubmit = document.createElement('input');
            buttonSubmit.type = 'submit';
            buttonSubmit.value = 'Submit';
            buttonSubmit.hidden = true;
            
            form.appendChild(inputName);
            form.appendChild(inputID);
            form.appendChild(buttonSubmit);
    
            let p = document.getElementById(id).children[0].children[0];
            p.parentNode.replaceChild(form,p);
        }

    }

    else if (event.target.matches(".next")) {
        let cat = window.location.href.split('/')[3]
        if (cat === "") {
            cat = 'default'
        }
        let num  = parseInt(sessionStorage.getItem("page"));
        num += 1;
        sessionStorage.setItem("page", String(num))
        let filt = sessionStorage.getItem("filter");
        const url = `/${cat}/${num}?filter=${filt}`
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        window.location.href = url;
    }

    else if (event.target.matches(".prev")) {
        let cat = window.location.href.split('/')[3]
        if (cat === "") {
            cat = 'default'
        }
        let num  = parseInt(sessionStorage.getItem("page"));
        num -= 1;
        if (num <= 0) {
            num = 1;
        }
        sessionStorage.setItem("page", String(num))
        let filt = sessionStorage.getItem("filter");
        const url = `/${cat}/${num}?filter=${filt}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json'
            }
        })
        window.location.href = url;
    }
})

document.getElementById("filter").addEventListener("click", async () => {
    let cat = window.location.href.split('/')[3]
    if (cat === "") {
        cat = 'default'
    }
    let val = document.getElementById("filter").value
    sessionStorage.setItem("filter",val);
    let num  = parseInt(sessionStorage.getItem("page"));
    let filt = sessionStorage.getItem("filter");
    const url = `/${cat}/${num}?filter=${filt}`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    window.location.href = url;
})

function validateForm() {
    if (document.getElementsByClassName("login").length > 0) {
        alert("You must be logged in to do that")
        return false;
    } else {
        return true;
    }
}