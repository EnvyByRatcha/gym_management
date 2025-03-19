<script>
  import axios from "axios";
  import { onMount } from "svelte";
  import Swal from "sweetalert2";
  import config from "../config";
  import { goto } from "$app/navigation";

  let name = "";
  let level = "";

  onMount(() => {
    fetchData();
  });

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(config.apiPath + "/api/user/info", {
        headers: {
          Authorization: token,
        },
      });

      if (res.data.name !== null) {
        name = res.data.name;
        level = res.data.level;
      }
    } catch (e) {
      Swal.fire({
        title: "error",
        text: e.message,
        icon: "error",
      });
    }
  };

  const signOut = async () => {
    const button = await Swal.fire({
      title: "Sign Out",
      text: "Confirm Sign Out ??",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
    });

    if (button.isConfirmed) {
      localStorage.removeItem("token");
      name = "";

      fetchData();
      goto("/");
    }
  };
</script>

<div class="wrapper">
  <aside class="main-sidebar sidebar-dark-primary elevation-4">
    <a href="index3.html" class="brand-link">
      <span class="brand-text font-weight-light ml-2">BackOffice</span>
    </a>

    <div class="sidebar">
      <div class="user-panel mt-3 pb-3 mb-3 d-flex">
        <div class="info">
          {#if name != undefined}
            <div class="d-block text-white">
              USER : <a href="/user/changeProfile" class="text-decoration-none">
                {name}{" [ " + level + " ]"}</a
              >
            </div>
            <div class="mt-2">
              <button class="btn btn-danger" on:click={() => signOut()}
                >Sign Out</button
              >
            </div>
          {/if}
        </div>
      </div>

      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          {#if level == "admin"}
            <li class="nav-item">
              <a href="/home" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Dashboard</p>
              </a>
            </li>

            <li class="nav-item">
              <a href="/user" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>User</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/trainer" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Trainer</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/device" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Device</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/course" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Course</p>
              </a>
            </li>

            <li class="nav-item">
              <a href="/payRecord" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Pay/Record</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/profit" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Profit</p>
              </a>
            </li>
          {/if}
          {#if level == "employee"}
            <li class="nav-item">
              <a href="/member" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Member</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/checkin" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Check in</p>
              </a>
            </li>
            <li class="nav-item">
              <a href="/courseWithTrainer" class="nav-link">
                <i class="nav-icon fas fa-th"></i>
                <p>Trainer/Course</p>
              </a>
            </li>
          {/if}
        </ul>
      </nav>
    </div>
  </aside>
</div>
