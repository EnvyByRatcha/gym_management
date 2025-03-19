<script>
  let salary = 0;
  let phone = "";
  let address = "";
  let gender = "male";
  let employee = [];
  let filter = {};
  let username = "";
  let password = "";
  let level = "";

  const cleatForm = () => {
    name = "";
    gender = "male";
    level = "employee";
    salary = 0;
    phone = "";
    address = "";
    username = "";
    password = "";
  };

  const save = () => {};
</script>

<div class="mt-3">
  <div>ระดับ</div>
  <input class="mr-2" type="radio" value="employee" name="level" bind:group={level} />พนักงาน
</div>

<div class="mt-3">
  <div>Username</div>
  <input class="form-control" bind:value={username} />
</div>

<div class="mt-3">
  <div>Password</div>
  <input class="form-control" bind:value={password} />
</div>

<button class="mt-3 btn btn-primary" on:click={() => save()}>
  <i class="fa fa-check me-2"></i>บันทึก
</button>
