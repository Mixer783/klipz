const SUPABASE_URL = "https://rpmmtptmpgljgbixvmhl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_z9hOCNfEo1THgkpJp7_svg_IVh59BPW";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const registerBox = document.getElementById("registerBox");
const loginBox = document.getElementById("loginBox");
const usuarioBox = document.getElementById("usuarioBox");
const registerSubmitButton = document.getElementById("registerSubmitButton");
const loginSubmitButton = document.getElementById("loginSubmitButton");
const usuarioSubmitButton = document.getElementById("usuarioSubmitButton");
const termsAceptationInput = document.getElementById("termsAceptationInput");
const usuarioBoxAtras = document.getElementById("usuarioBoxAtras")
const loginPasswordInput = document.getElementById("loginPasswordInput");
const loginEmailInput = document.getElementById("loginEmailInput");
const usernameErroresLog = document.getElementById("usernameErroresLog");
const logeoErroresLog = document.getElementById("logeoErroresLog");

const enseñarLogin = document.getElementById("enseñarLogin");
const enseñarRegister = document.getElementById("enseñarRegister");

enseñarLogin.addEventListener("click", () => {
    registerBox.style.display = "none";
    loginBox.style.display = "flex";
    usuarioBox.style.display = "none"
})

enseñarRegister.addEventListener ("click", () =>{
    loginBox.style.display = "none";
    registerBox.style.display = "flex";
    usuarioBox.style.display = "none"
})

registerSubmitButton.addEventListener("click", (event) => {
    event.preventDefault();

    loginBox.style.display = "none"
    registerBox.style.display = "none"
    usuarioBox.style.display = "flex"
})

usuarioBoxAtras.addEventListener("click", () => {
    loginBox.style.display = "none";
    registerBox.style.display = "flex";
    usuarioBox.style.display = "none";
})

loginSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();
    const loginEmail = loginEmailInput.value;
    const loginPassword = loginPasswordInput.value;
    const { data, error} = await supabaseClient.auth.signInWithPassword({
    email: loginEmail,
    password: loginPassword,
});

    if (error) {
         logeoErroresLog.textContent = error.message;
         return;
    } 
    window.location.href = "../paginas/dashboard.html";
})

const registerEmailInput = document.getElementById("registerEmailInput");
const registerPasswordInput = document.getElementById("registerPasswordInput");
const registerUsernameInput = document.getElementById("registerUsernameInput");

const params = new URLSearchParams(window.location.search);
const usernameDesdeURL = params.get("registerUsernameInput");
registerUsernameInput.value = usernameDesdeURL;

registerUsernameInput.addEventListener("input", () => {
    if (registerUsernameInput.value !== registerUsernameInput.value.toLowerCase() || registerUsernameInput.value.includes(" ")) {
        usernameErroresLog.textContent = ("You can not use upper cases or spaces as username.");
    }
    else {
        usernameErroresLog.textContent = "";
    }
});

usuarioSubmitButton.addEventListener("click", async (event) => {
    event.preventDefault();

    if (termsAceptationInput.checked == false){
        usernameErroresLog.textContent = "You can't create an account without accepting the terms and privacy policies of Klipz.";
        return;
    }

    const registerEmail = registerEmailInput.value;
    const registerPassword = registerPasswordInput.value;
    const registerUsername = registerUsernameInput.value;
    
    const { data, error } = await supabaseClient.auth.signUp({
        email: registerEmail,
        password: registerPassword,
        options: {
            data: {
                username: registerUsername
            },
            emailRedirectTo: `${window.location.origin}/dashboard.html`
        }
    });

    if (error){
        console.error("Auth error:", error);
        usernameErroresLog.textContent = "Auth error: " + error.message;
        return;
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    if (data.user) {
        const { error: profileError } = await supabaseClient
        .from('profiles')
        .upsert({
            id: data.user.id,
            username: registerUsername
        });
        
        if (profileError) {
    console.error("Profile error:", profileError);

    if (profileError.message.includes('row-level security')) {
        usernameErroresLog.textContent = "Confirm your email to login";
    } else {
        usernameErroresLog.textContent = "Something went wrong. Please try again.";
    }
    return;
}
}

    alert("Account created successfully!");
    window.location.href = "../paginas/dashboard.html";
});

function enseñarContraseñaRegistro() {
    if (registerPasswordInput.type == "password"){
        (registerPasswordInput.type) = "text";
    }
    else (registerPasswordInput.type) = "password";
};

function enseñarContraseñaLogin() {
    if (loginPasswordInput.type == "password"){
        (loginPasswordInput.type) = "text";
    }
    else (loginPasswordInput.type) = "password";
};