const SUPABASE_URL = "https://rpmmtptmpgljgbixvmhl.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_z9hOCNfEo1THgkpJp7_svg_IVh59BPW";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* logeo/verificacion de cuentas etc */

const widgetMusicCheckbox = document.getElementById("widgetMusicCheckbox");
const widgetMusicUrlInput = document.getElementById("widgetMusicUrlInput");
const musicaTituloCancion = document.getElementById("musicaTituloCancion");

async function verificarSesion() {

    const { data, error } = await supabaseClient.auth.getUser();
    usuarioActual = data.user;
    if (!data.user){
        window.location.href = "../paginas/auth.html"
    }

    /* cargamiento de los datos existentes del usuario */

    /* avatar */

    const { data: perfilData, error: perfilError } = await supabaseClient
    .from('profiles')
    .select('*')
    .eq('id', data.user.id);
    perfilDataGlobal = perfilData[0];

    const labelPersonalizacionAvatar = document.getElementById("labelPersonalizacionAvatar");
    if (perfilData[0].avatar_url) {
    labelPersonalizacionAvatar.style.backgroundImage = `url(${perfilData[0].avatar_url})`;}
    avatarUrlFinal = perfilData[0].avatar_url;

  /* avatar dashboard.html (header) */

    let fotoPerfilHome = document.getElementById("fotoPerfilHome");
    fotoPerfilHome.src = `${perfilData[0].avatar_url}?t=${Date.now()}`;

    /* banner */

    const labelPersonalizacionBanner = document.getElementById("labelPersonalizacionBanner");
    if (perfilData[0].banner_url) {
    labelPersonalizacionBanner.style.backgroundImage = `url(${perfilData[0].banner_url})`;}
    bannerUrlFinal = perfilData[0].banner_url;

    /* bio */

    const bioTextareaPage = document.getElementById("bioTextareaPage");
    bioTextareaPage.value = perfilData[0].bio;

    /* links */

     const { data: linksData, error: linksError } = await supabaseClient
    .from('links')
    .select('*')
    .eq('profile_id', data.user.id);

    const linkInstagram = linksData.find(link => link.platform === "instagram");
    const linkTiktok = linksData.find(link => link.platform === "tiktok");
    const linkDiscord = linksData.find(link => link.platform === "discord");
    const linkPaypal = linksData.find(link => link.platform === "paypal");

    const inputPageLinkInstagram = document.getElementById("inputPageLinkInstagram");
    const inputPageLinkTikTok = document.getElementById("inputPageLinkTikTok");
    const inputPageLinkDiscord = document.getElementById("inputPageLinkDiscord");
    const inputPageLinkPayPal = document.getElementById("inputPageLinkPayPal");

    if (linkInstagram) inputPageLinkInstagram.value = linkInstagram.url;
    if (linkTiktok) inputPageLinkTikTok.value = linkTiktok.url;
    if (linkDiscord) inputPageLinkDiscord.value = linkDiscord.url;
    if (linkPaypal) inputPageLinkPayPal.value = linkPaypal.url;

    /* widgets */

    widgetMusicCheckbox.checked = perfilData[0].music_enabled;
    musicaTituloCancion.value = perfilData[0].music_title;


    /* pestaña home */

    const botonCopiarURLHomeTexto = document.getElementById("botonCopiarURLHomeTexto");
    const elementosEstadisticasVisitas = document.getElementById("elementosEstadisticasVisitas");

    botonCopiarURLHomeTexto.textContent = `klipz.fun/${perfilData[0].username}`;
    elementosEstadisticasVisitas.textContent = `${perfilData[0].profile_views} Views`;

    const botonCopiarURLHome = document.getElementById("botonCopiarURLHome");

    botonCopiarURLHome.addEventListener("click", async () => {
    const url = document.getElementById("botonCopiarURLHomeTexto").textContent;
    await navigator.clipboard.writeText(`https://${url}`);
});


}
verificarSesion()

/* cambiar pestañas */

const elementosDivHome = document.getElementById("elementosDivHome");
const elementosDivPage = document.getElementById("elementosDivPage");
const sideVarNavBotonHome = document.getElementById("sideVarNavBotonHome");
const sideVarNavBotonPage = document.getElementById("sideVarNavBotonPage");

sideVarNavBotonHome.addEventListener("click", () => {
    elementosDivHome.style.display = "";
    elementosDivPage.style.display = "none";
});

sideVarNavBotonPage.addEventListener("click", () => {
    elementosDivHome.style.display = "none";
    elementosDivPage.style.display = "";
});

/* pestaña page */

/* subir fotos al avatar y banner (frontend y backend) */

const labelPersonalizacionAvatar = document.getElementById("labelPersonalizacionAvatar");
const inputPersonalizacionAvatar = document.getElementById("inputPersonalizacionAvatar");
const labelPersonalizacionBanner = document.getElementById("labelPersonalizacionBanner");
const inputPersonalizacionBanner = document.getElementById("inputPersonalizacionBanner");

let archivoAvatarSeleccionado = null;
let archivoBannerSeleccionado = null;
let archivoMusicaSeleccionado = null;

let avatarUrlFinal = null;
let bannerUrlFinal = null;

let perfilDataGlobal = null;
let usuarioActual = null;

inputPersonalizacionAvatar.addEventListener("change", () => {
    const archivo = inputPersonalizacionAvatar.files[0];
    archivoAvatarSeleccionado = archivo
    const urlTemporal = URL.createObjectURL(archivo);
    labelPersonalizacionAvatar.style.backgroundImage = `url(${urlTemporal})`;
});

inputPersonalizacionBanner.addEventListener("change", () => {
    const archivo = inputPersonalizacionBanner.files[0];
    archivoBannerSeleccionado = archivo
    const urlTemporal = URL.createObjectURL(archivo);
    labelPersonalizacionBanner.style.backgroundImage = `url(${urlTemporal})`;
});

const LIMITE_MUSICA_BYTES = 5 * 1024 * 1024;

widgetMusicUrlInput.addEventListener("change", () => {
    const archivo = widgetMusicUrlInput.files[0];
    
    if (archivo && archivo.size > LIMITE_MUSICA_BYTES) {
        alert("The file can't be larger than 5MB.");
        widgetMusicUrlInput.value = "";
        return;
    }
    
    archivoMusicaSeleccionado = archivo;
});

/* publicar informacion */

/* publicar avatar/banner */

const publicarPageBoton = document.getElementById("publicarPageBoton");

publicarPageBoton.addEventListener("click", async (event) => {
    event.preventDefault();

    if (archivoAvatarSeleccionado) {
        const { data: avatarUploadData, error: avatarUploadError } = await supabaseClient.storage
            .from('avatars')
            .upload(`${usuarioActual.id}-avatar`, archivoAvatarSeleccionado, { upsert: true });
            console.log("Error de upload avatar:", avatarUploadError);
    const { data: avatarUrlData } = supabaseClient.storage
    .from('avatars')
    .getPublicUrl(`${usuarioActual.id}-avatar`);
    avatarUrlFinal = avatarUrlData.publicUrl + '?t=' + Date.now();
    }

    if (archivoBannerSeleccionado) {
    const { data: bannerUploadData, error: bannerUploadError } = await supabaseClient.storage
        .from('banners')
        .upload(`${usuarioActual.id}-banner`, archivoBannerSeleccionado, { upsert: true });

        console.log("Subiendo a:", `${usuarioActual.id}-avatar`);
        console.log("Usuario actual:", usuarioActual);
        
        const { data: bannerUrlData } = supabaseClient.storage
    .from('banners')
    .getPublicUrl(`${usuarioActual.id}-banner`);
    bannerUrlFinal = bannerUrlData.publicUrl + '?t=' + Date.now();
}

let musicUrlFinal = perfilDataGlobal.music_url;

if (archivoMusicaSeleccionado) {
    const { data: musicUploadData, error: musicUploadError } = await supabaseClient.storage
        .from('music')
        .upload(`${usuarioActual.id}-music`, archivoMusicaSeleccionado, { upsert: true });

    if (musicUploadError) {
        console.error("Error uploading the song:", musicUploadError);
        alert("Error uploading the song.");
        return;
    }

    const { data: musicUrlData } = supabaseClient.storage
        .from('music')
        .getPublicUrl(`${usuarioActual.id}-music`);
    musicUrlFinal = musicUrlData.publicUrl + '?t=' + Date.now();
}

const {data: updateAData, error: updateError} = await supabaseClient
    .from('profiles')
    .update({
        bio: bioTextareaPage.value,
        avatar_url: avatarUrlFinal,
        banner_url: bannerUrlFinal,
        music_enabled: widgetMusicCheckbox.checked,
        music_title: musicaTituloCancion.value,
        music_url: musicUrlFinal
    })
    .eq('id', usuarioActual.id);

    if (updateError) {
        alert("Error saving the changes.");
        return;
    }

/* publicar links/guardar */

const linksParaGuardar = [
    { profile_id: usuarioActual.id, platform: "instagram", url: inputPageLinkInstagram.value },
    { profile_id: usuarioActual.id, platform: "tiktok", url: inputPageLinkTikTok.value },
    { profile_id: usuarioActual.id, platform: "discord", url: inputPageLinkDiscord.value },
    { profile_id: usuarioActual.id, platform: "paypal", url: inputPageLinkPayPal.value }
];

const { error: linksUpsertError } = await supabaseClient
    .from('links')
    .upsert(linksParaGuardar, { onConflict: 'profile_id,platform' });

if (linksUpsertError) {
    console.error("Error saving links:", linksUpsertError);
    alert("Error saving links.");
    return;
}

alert("Changes saved!");
});

/* Menú hamburguesa para móviles */
const hamburgerBtn = document.getElementById("hamburgerBtn");
const sideVarNav = document.querySelector(".side-var-nav");
const menuOverlay = document.getElementById("menuOverlay");
const navButtons = document.querySelectorAll(".side-var-nav-boton");

function toggleMenu() {
    sideVarNav.classList.toggle("active");
    menuOverlay.classList.toggle("active");
}

hamburgerBtn.addEventListener("click", toggleMenu);
menuOverlay.addEventListener("click", toggleMenu);

// Cerrar menú al hacer clic en un botón de navegación
navButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (window.innerWidth <= 768) {
            sideVarNav.classList.remove("active");
            menuOverlay.classList.remove("active");
        }
    });
});

/* cerrar sesión y eliminar cuenta */

const botonCerrarSesion = document.querySelector(".botones-cuenta-cerrar-sesion");
const botonEliminarCuenta = document.querySelector(".botones-cuenta-eliminar-cuenta");

botonCerrarSesion.addEventListener("click", async () => {
    await supabaseClient.auth.signOut();
    window.location.href = "../index.html";
});

botonEliminarCuenta.addEventListener("click", async () => {
    const confirmacion = confirm(
        "Are you sure you want to delete your account? This action is permanent and cannot be undone."
    );
    if (!confirmacion) return;

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
        window.location.href = "../index.html";
        return;
    }

    await supabaseClient.storage.from("avatars").remove([`${user.id}-avatar`]);
    await supabaseClient.storage.from("banners").remove([`${user.id}-banner`]);
    await supabaseClient.storage.from("music").remove([`${user.id}-music`]);

    await supabaseClient.from("links").delete().eq("profile_id", user.id);
    await supabaseClient.from("profiles").delete().eq("id", user.id);

    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${session.access_token}`,
                apikey: SUPABASE_ANON_KEY
            }
        });

        if (!response.ok) {
            alert("Error deleting your account. Please try again.");
            return;
        }
    }

    await supabaseClient.auth.signOut();
    window.location.href = "../index.html";
});