document.addEventListener('DOMContentLoaded', () => {

    //  elementos enlazados
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const recuperarView = document.getElementById("correo");
    const contraseñaView = document.getElementById("contraseña");

    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    const showRegisterLink = document.getElementById('show-register-link');
    const cancelRegisterBtn = document.getElementById('cancel-register-btn');
    
    const recordar = document.getElementById("recordar-contraseña");

    const correoInput = document.getElementById("correoInput");
    const validarCorreoBtn = document.getElementById("validarCorreoBtn");
    const nuevaPassword = document.getElementById("nuevaPassword");
    const confirmPassword = document.getElementById("confirmPassword");
    const cambiarContraseñaBtn = document.getElementById("cambiarContraseñaBtn");

    let correoEncontrado = null;

    // cambio de pagina
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        registerView.classList.remove('hidden');
    });

    cancelarRegistro = () => {
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');
    }

    recordar.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.classList.add('hidden');
        recuperarView.classList.remove('hidden');
    });

    cancelRegisterBtn.addEventListener('click', cancelarRegistro);


    const cancelRegister2Btn = document.getElementById("cancelar-recuperar2-btn");

    cancelRegister2Btn .addEventListener("click", () => {
        contraseñaView.classList.add("hidden");
        loginView.classList.remove("hidden");
    });

    const cancelarRecuperarBtn = document.getElementById("cancelar-recuperar-btn");

    cancelarRecuperarBtn.addEventListener("click", () => {
        recuperarView.classList.add("hidden");
        loginView.classList.remove("hidden");
    });

    //registro de los usuarios
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const idNumber = e.target.idNumberReg.value;
        const password = e.target.passwordReg.value;
        const email = e.target.emailReg.value;
        const users = JSON.parse(localStorage.getItem('users')) || [];

        console.log("ID ingresado:", idNumber);
        console.log("Email ingresado:", email);

        const userExists = users.some(user => user.idNumber === idNumber);
        const emailExists = users.some(user => user.email === email)
        if (userExists) {
            Swal.fire('❌ ¡Error!', 'Ya existe una cuenta asociada a esa cédula.', 'error');
            return;
        }

        if (emailExists) {
            Swal.fire('❌ ¡Error!', 'Ya existe un email a asociado.', 'error');
            return;
        }

        const newUser = {
            idType: e.target.idTypeReg.value,
            idNumber: idNumber,
            firstName: e.target.firstNameReg.value,
            lastName: e.target.lastNameReg.value,
            email: e.target.emailReg.value,
            password: password,
            account: {
                accountNumber: `ACME${Math.floor(100000 + Math.random() * 900000)}`,
                creationDate: new Date().toLocaleString('es-CO', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                   
                    hour12: false
                }),
                balance: 0,
                transactions: []
            }
        };

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        Swal.fire({
            title: "✅ Cuenta creada exitosamente",
            text: `Tu número de cuenta es: ${newUser.account.accountNumber}`,
            icon: "success",
            iconColor: "#FFD700"
        });

        registerForm.reset();
        registerView.classList.add('hidden');
        loginView.classList.remove('hidden');

        


    });

    // inicio de session
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const idNumber = e.target.idNumber.value;
        const password = e.target.password.value;

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.idNumber === idNumber && u.password === password);



        if (user) {
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            Swal.fire({
                text: `Bienvenido ${user.firstName}`,
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
                iconColor: "#FFD700"
            })
                .then(() => {
                    window.location.href = './dashboard.html';
                });
        } else {
            Swal.fire({
                title: `ERROR`,
                text: "contraseña o numero de identificacion no encontrada",
                icon: "error",
                timer: 1500,
                showConfirmButton: false,
            })
        }
    });

    // validamos el correo aquí
    let codigoGenerado = null;

    validarCorreoBtn.addEventListener("click", () => {
        const correoIngresado = correoInput.value.trim();
        if (correoIngresado === "") {
            Swal.fire({
                title: "Campo vacío",
                text: "Por favor ingresa un correo electrónico.",
                icon: "warning"
            });
            return;
        }
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const user = users.find(u => u.email === correoIngresado);

        if (user) {
            correoEncontrado = user.email;
            // generador de codigo de verificacion
            codigoGenerado = Math.floor(100000 + Math.random() * 900000).toString();
            Swal.fire(` Este es tu codigo de verificacion: ${codigoGenerado}`, "Ahora puedes cambiar tu contraseña.", "success");
            

            // Mostrar campo, botón y label del código
            document.getElementById("codigoVerificacion").classList.remove("hidden");
            document.getElementById("verificarCodigoBtn").classList.remove("hidden");
            document.getElementById("labelCodigo").classList.remove("hidden"); 

        } else {
            Swal.fire({
                title: "Correo no encontrado",
                text: "No hay ninguna cuenta asociada a este correo.",
                icon: "error"
            });
        }
    });


    //  VALIDAR EL CODIGO ANTES DE CAMBIAR LA CONTRASEÑA
    document.getElementById("verificarCodigoBtn").addEventListener("click", () => {
        const codigoIngresado = document.getElementById("codigoVerificacion").value.trim();

        if (codigoIngresado === codigoGenerado) {
            Swal.fire("✅ Código correcto", "Ahora puedes cambiar tu contraseña.", "success");
            document.getElementById("codigoVerificacion").classList.add("hidden");
            document.getElementById("verificarCodigoBtn").classList.add("hidden");
            document.getElementById("labelCodigo").classList.add("hidden");
        
            recuperarView.classList.add("hidden");
            contraseñaView.classList.remove("hidden");
        } else {
            Swal.fire("❌ Código incorrecto", "Por favor, verifica el código.", "error");
        }
        
    });



    // relacionado al cambio de contraseña
    cambiarContraseñaBtn.addEventListener("click", () => {
        const nueva = nuevaPassword.value.trim();
        const confirmar = confirmPassword.value.trim();

        if (nueva === "" || confirmar === "") {
            Swal.fire('⚠️', 'Por favor, completa ambos campos.', 'warning');
            return;
        }

        if (nueva !== confirmar) {
            Swal.fire('❌', 'Las contraseñas no coinciden.', 'error');
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || [];
        const index = users.findIndex(u => u.email === correoEncontrado);

        if (index !== -1) {
            users[index].password = nueva;
            localStorage.setItem("users", JSON.stringify(users));

            Swal.fire({
                title: "Contraseña actualizada",
                text: "Ya puedes iniciar sesión con tu nueva contraseña.",
                icon: "success"
            });

            contraseñaView.classList.add("hidden");
            loginView.classList.remove("hidden");

        }
    });

});

const API_BASE = "https://api-colombia.com/api/v1";
const citySelect = document.getElementById("cities");

async function loadCities() {
    try {
        const res = await fetch(`${API_BASE}/City`);
        const cities = await res.json();

        cities.forEach(city => {
            const option = document.createElement("option");
            option.value = city.name;
            option.textContent = city.name;
            citySelect.appendChild(option);
        });
    } catch (error) {
        console.error("Error al cargar ciudades:", error);
    }
}

loadCities();

creationDate: new Date().toLocaleString('es-CO', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })