const SUPABASE_URL = "https://rpmmtptmpgljgbixvmhl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_z9hOCNfEo1THgkpJp7_svg_IVh59BPW";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const usuarioInput = document.getElementById("usuarioInput");
const usuarioInputLog = document.getElementById("usuarioInputLog");


async function usuarioInputBoton() {

    if (usuarioInput.value !== usuarioInput.value.toLowerCase() || usuarioInput.value.includes(" ")){
        usuarioInputLog.textContent = ("You can not use upper cases or spaces as username.");
        return;
    }

    const { data: usernameCheckData, error: usernameCheckError } = await supabaseClient
    .from('profiles')
    .select('username')
    .eq('username', usuarioInput.value);
    
    if (usernameCheckData.length == 1){
    usuarioInputLog.textContent = "Username taken, choose another one.";
    return;
    }
    window.location.href = `../paginas/auth.html?registerUsernameInput=${usuarioInput.value}`;
}

usuarioInput.addEventListener("input", () => {
    if (usuarioInput.value !== usuarioInput.value.toLowerCase() || usuarioInput.value.includes(" ")) {
        usuarioInputLog.textContent = ("You can not use upper cases or spaces as username.");
    }
    else {
        usuarioInputLog.textContent = "";
    }
});