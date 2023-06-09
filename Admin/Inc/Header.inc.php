<!DOCTYPE html>
<html>
<head>
    <meta charset='utf-8'>
    <meta http-equiv='X-UA-Compatible' content='IE=edge'>
    <title></title>
    <meta name='viewport' content='width=device-width, initial-scale=1'>

    
    <!-- LINK THE FONT AWESOME LIBRARY -->
    <link rel="stylesheet" href="../../Styles/fonts/Awesome/css/all.min.css">
    <!-- LINK THE RSET CSS FILE -->
    <link rel="stylesheet" href="../../Styles/reset.css">
    <!-- LINK THE STYLE FILE -->
    <link rel="stylesheet" href="../../Styles/Admin/Header.css">
    <link rel="stylesheet" href="../../Styles/Admin/dashboard.css">
    <link rel="stylesheet" href="../../Styles/Admin/classes.css">
    <link rel="stylesheet" href="../../Styles/Admin/etudiants.css">
    <link rel="stylesheet" href="../../Styles/Admin/general.css">

    <!-- LINK ALL THE JS FILES -->
    <script defer src="../../Scripts/Header.js"></script>
</head>
<body>
    <header>
        <div class="logo">
            <img src="../Images/logo/logo-transparent.png" alt="M6 logo">
        </div>
        <div class="section-title">
            <h2 id="header-title">Liste d'absence</h2>
            <span class="detail" id="header-title-details">Classes</span>
        </div>
        <div class="today-date" id="today-date">
            <?php     
                setlocale(LC_ALL, "fr_FR", 'FRA');
                echo ucwords(strftime("%A %d %B %Y"));
            ?>
        </div>
        <div class="profile--btn">
            <div class="profile--image">
                <img id="prof-img">
                <div class="name">
                    <p id="prof-name"></p>
                    <i class="fas fa-caret-down"></i>
                </div>
            </div>
            <div class="profile--menu">
                <button id="profile-btn">
                    <i class="fas fa-user"></i>
                    <p>Profile</p>
                </button>
                <a href="./Inc/logout.php">
                    <i class="fas fa-right-from-bracket"></i>
                    <p>Déconnexion</p>
                </a>
            </div>
        </div>
    </header>
    <nav>
        <ul>
            <li class="list active">
                <button id="dashboard-btn">
                    <i class="awesome-icon fas fa-table-columns"></i>
                    <div class="text">Dashboard</div>
                </button>
            </li>
            <li class="list">
                <button id="statistique-btn">
                    <i class="awesome-icon fas fa-chart-pie"></i>
                    <div class="text">Statistiques</div>
                </button>
            </li>
            <li class="list">
                <button id="profs-btn">
                    <i class="awesome-icon fas fa-users"></i>
                    <div class="text">Professeurs</div>
                </button>
            </li>
            <li class="list">
                <button id="classes-btn">
                    <i class="awesome-icon fas fa-users"></i>
                    <div class="text">Classes</div>
                </button>
            </li>
                <li class="list">
                    <button id="settings-btn">
                    <i class="awesome-icon fas fa-gear"></i>                       
                        <div class="text">paramétre</div>
                    </button>
                </li>
            <div class="indicator">
                <dic class="circle"></div>
            </div>
        </ul>
    </nav>
    <div class="alerts-container"></div>
    <div class="popup-container"></div>