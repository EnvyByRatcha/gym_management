<script>
  import { goto } from "$app/navigation";
  import axios from "axios";
  import Swal from "sweetalert2";

  let username = "";
  let password = "";

  async function signIn() {
    try {
      if (username == "" || password == "") {
        Swal.fire({
          title: "username or password is Invalid",
          text: "Please try again",
          icon: "warning",
        });
      } else {
        const payload = { username: username, password: password };
        const res = await axios.post(
          "http://localhost:3000/api/user/signIn",
          payload
        );

        if (res.data.token !== undefined) {
          localStorage.setItem("token", res.data.token);
          goto("/");
        }
        if (res.data.token) {
          goto("/home").then(() => {
            window.location.reload();
          });
        }
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  }
</script>

<div class="card mt-3">
  <div class="card-header bg-primary">SignIn to BackOffice</div>
  <div class="card-body">
    <div>
      <div>Username</div>
      <input class="form-control" bind:value={username} />
    </div>
    <div class="mt-3">
      <div>Password</div>
      <input class="form-control" type="password" bind:value={password} />
    </div>
    <div class="mt-3">
      <button class="btn btn-primary" on:click={() => signIn()}
        ><i class="fa fa-check mr-2"></i>SignIn</button
      >
    </div>
  </div>
</div>
