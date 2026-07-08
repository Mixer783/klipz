const SUPABASE_URL = "https://rpmmtptmpgljgbixvmhl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_z9hOCNfEo1THgkpJp7_svg_IVh59BPW";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* cargamiento del perfil */

async function cargarPerfil() {
    const params = new URLSearchParams(window.location.search);
    const usernameBuscado = params.get("u");

    if (!usernameBuscado) {
        document.body.innerHTML = "<h1 style='color:white'>User not specified</h1>";
        return;
    }

    const { data: profileData, error } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('username', usernameBuscado)
        .single();

    if (error || !profileData) {
        document.body.innerHTML = "<h1 style='color:white'>User not found</h1>";
        return;
    }

/* elementos */

    console.log(profileData);
    document.getElementById("elementosAvatarPerfil").src = profileData.avatar_url;
    document.getElementById("bannerPerfilPublico").style.backgroundImage = `url(${profileData.banner_url})`;
    document.getElementById("elementosUsernamePerfil").textContent = profileData.username;
    document.getElementById("elementosDescripcionPerfil").textContent = profileData.bio;

    const { data: linksData, error: linksError } = await supabaseClient
    .from('links')
    .select('*')
    .eq('profile_id', profileData.id);

    const linkInstagram = linksData.find(link => link.platform === "instagram");
    const linkTiktok = linksData.find(link => link.platform === "tiktok");
    const linkDiscord = linksData.find(link => link.platform === "discord");
    const linkPaypal = linksData.find(link => link.platform === "paypal");

if (linkInstagram && linkInstagram.url) {
    document.getElementById("elementosRedesPerfil0").style.display = "flex";
    document.getElementById("elementosRedesPerfil0").href = linkInstagram.url;
}
if (linkDiscord && linkDiscord.url) {
    document.getElementById("elementosRedesPerfil1").style.display = "flex";
    document.getElementById("elementosRedesPerfil1").href = linkDiscord.url;
}
if (linkTiktok && linkTiktok.url) {
    document.getElementById("elementosRedesPerfil2").style.display = "flex";
    document.getElementById("elementosRedesPerfil2").href = linkTiktok.url;
}
if (linkPaypal && linkPaypal.url) {
    document.getElementById("elementosRedesPerfil3").style.display = "flex";
    document.getElementById("elementosRedesPerfil3").href = linkPaypal.url;
}

if (linkPaypal && linkPaypal.url) {
    document.getElementById("elementosRedesPerfil3").style.display = "flex";
    document.getElementById("elementosRedesPerfil3").href = linkPaypal.url;
}

if (profileData.music_enabled) {
    document.getElementById("musicaWidgetDiv").style.display = "flex";
    iniciarWidgetMusica(profileData.music_url, profileData.music_title);
}

}

cargarPerfil();

/* widget musica */

function iniciarWidgetMusica(musicUrl, musicTitle) {
    const audio = document.getElementById("musicaAudioElement");
    const botonPlay = document.getElementById("musicaBotonPlay");
    const barra = document.getElementById("musicaBarra");
    const tituloEl = document.getElementById("musicaTitulo");
    const tiempoActualEl = document.getElementById("musicaTiempoActual");
    const tiempoTotalEl = document.getElementById("musicaTiempoTotal");

    audio.src = musicUrl;
    tituloEl.textContent = musicTitle || "Unknown track";

    function formatearTiempo(segundos) {
        const min = Math.floor(segundos / 60);
        const seg = Math.floor(segundos % 60).toString().padStart(2, "0");
        return `${min}:${seg}`;
    }

    audio.addEventListener("loadedmetadata", () => {
        tiempoTotalEl.textContent = formatearTiempo(audio.duration);
    });

    botonPlay.addEventListener("click", () => {
        if (audio.paused) {
            audio.play();
            botonPlay.textContent = "⏸";
        } else {
            audio.pause();
            botonPlay.textContent = "▶";
        }
    });

    audio.addEventListener("timeupdate", () => {
        const porcentaje = (audio.currentTime / audio.duration) * 100;
        barra.value = porcentaje;
        tiempoActualEl.textContent = formatearTiempo(audio.currentTime);
    });

    barra.addEventListener("input", () => {
        const nuevoTiempo = (barra.value / 100) * audio.duration;
        audio.currentTime = nuevoTiempo;
    });
}