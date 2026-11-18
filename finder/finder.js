const form = document.querySelector("#search-form");
const input = document.querySelector("#input-box");
const button = document.querySelector("#search-btn");
const Status = document.querySelector("#status");
const avatar = document.querySelector("#avatar");
const display_name = document.querySelector("#display-name");
const login = document.querySelector("#login");
const bio = document.querySelector("#bio");
const repos = document.querySelector("#public_repos");
const followers = document.querySelector("#followers");
const following = document.querySelector("#following");
const profile_link = document.querySelector("#profile-link");
const profile = document.querySelector("#profile");

async function search() {
    const value = input.value;
    const username = value.trim();

    if (username === "") {
        // invalid
        Status.textContent = "ユーザー名を入力してください。";
        return;
    }

    try {
        button.disabled = true;
        // loading
        Status.textContent = "検索中";
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`);

        if (response.status === 404) {
            // not found
            throw new Error("ユーザーが見つかりません");
        } else if (response.status === 403 || response.status === 429) {
            // rate-limit
            throw new Error("しばらく時間をおいて再度お試しください");
        } else if (!response.ok) {
            throw new Error("取得に失敗しました。通信環境を確認してください。")
        }

        const data = await response.json();

        // success
        Status.textContent = "";

        const name = data.name ?? data.login;
        display_name.textContent = `${name}`;
        const log = data.login ?? "入力されていません"
        login.textContent = `@${log}` ;
        avatar.src = data.avatar_url;
        avatar.alt = `${data.login}のプロフィール画像`;
        if (data.bio !== null) {
            bio.textContent = `説明欄: ${data.bio}`;
        } else {
            bio.textContent = "説明欄: 入力されていません。";
        }
        repos.textContent = data.public_repos;
        followers.textContent = data.followers;
        following.textContent = data.following;
        profile_link.href = data.html_url;
        profile.hidden = false;
        
    } catch (error) {
        Status.classList.add("active1");

        if (
            error.message === "ユーザーが見つかりません" ||
            error.message === "しばらく時間をおいて再度お試しください"
        ) {
            Status.textContent = error.message;
        } else {
            Status.textContent = "取得に失敗しました。通信環境を確認してください。";
        }

        console.error(error);
    } finally {
        button.disabled = false;
    }
}

form.addEventListener("submit", (event) => {
    Status.classList.remove("active1")
    event.preventDefault();
    profile.hidden = true;

    search();

})
