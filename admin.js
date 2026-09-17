document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (loginForm) {

        loginForm.addEventListener("submit", loginAdmin);

    }

    if (document.getElementById("complaintTable")) {

        loadComplaints();

    }

});


async function loginAdmin(e) {

    e.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const message =
        document.getElementById("loginMessage");

    message.innerHTML = "Memeriksa login...";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: new URLSearchParams({

                action: "login",

                username: username,

                password: password

            })

        });

        const data = await response.json();

        if (!data.success) {

            message.innerHTML =
                "Username atau password salah.";

            return;

        }

        localStorage.setItem(
            "adminToken",
            data.token
        );

        window.location.href = "admin.html";

    } catch (error) {

        console.error(error);

        message.innerHTML =
            "Gagal menghubungi server.";

    }

}


async function loadComplaints() {

    const token =
        localStorage.getItem("adminToken");

    if (!token) {

        window.location.href =
            "login-admin.html";

        return;

    }

    const table =
        document.getElementById("complaintTable");

    table.innerHTML = `
        <tr>
            <td colspan="9">
                Memuat data...
            </td>
        </tr>
    `;

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: new URLSearchParams({

                action: "list",

                token: token

            })

        });

        const data = await response.json();

        if (!data.success) {

            localStorage.removeItem("adminToken");

            window.location.href =
                "login-admin.html";

            return;

        }

        if (!data.data || data.data.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="9">
                        Belum ada pengaduan.
                    </td>
                </tr>
            `;

            return;

        }

        table.innerHTML = "";

        data.data.forEach(item => {

            const row =
                document.createElement("tr");

            row.innerHTML = `

                <td>${item.id}</td>

                <td>${item.timestamp}</td>

                <td>${item.nama}</td>

                <td>${item.kontak}</td>

                <td>${item.kategori}</td>

                <td>${item.pengaduan}</td>

                <td>
                    <strong>
                        ${item.status}
                    </strong>
                </td>

                <td>
                    ${item.tanggapan || "-"}
                </td>

                <td>

                    <button
                        onclick="respondComplaint('${item.id}')"
                    >
                        Tanggapi
                    </button>

                    <button
                        onclick="rejectComplaint('${item.id}')"
                    >
                        Tolak
                    </button>

                </td>

            `;

            table.appendChild(row);

        });

    } catch (error) {

        console.error(error);

        table.innerHTML = `
            <tr>
                <td colspan="9">
                    Gagal mengambil data.
                </td>
            </tr>
        `;

    }

}


async function respondComplaint(id) {

    const responseText =
        prompt("Masukkan tanggapan:");

    if (!responseText) return;

    await updateComplaint(
        id,
        "Diproses",
        responseText
    );

}


async function rejectComplaint(id) {

    const alasan =
        prompt("Masukkan alasan penolakan:");

    if (!alasan) return;

    await updateComplaint(
        id,
        "Ditolak",
        alasan
    );

}


async function updateComplaint(
    id,
    status,
    tanggapan
) {

    const token =
        localStorage.getItem("adminToken");

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            body: new URLSearchParams({

                action: "update",

                token: token,

                id: id,

                status: status,

                tanggapan: tanggapan

            })

        });

        const data = await response.json();

        if (!data.success) {

            alert(
                data.message ||
                "Gagal memperbarui pengaduan."
            );

            return;

        }

        alert("Pengaduan berhasil diperbarui.");

        loadComplaints();

    } catch (error) {

        console.error(error);

        alert(
            "Gagal menghubungi database."
        );

    }

}


function logoutAdmin() {

    localStorage.removeItem(
        "adminToken"
    );

    window.location.href =
        "login-admin.html";

}
