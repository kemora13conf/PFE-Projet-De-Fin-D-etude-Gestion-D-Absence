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
    <link rel="stylesheet" href="../../Styles/Professor/Profile.css">
    <?php
        $role = json_decode($_SESSION['user'], true)[2];
        if($role == 'professor'){
    ?>
        <link rel="stylesheet" href="../../Styles/Professor/Header.css">
        <link rel="stylesheet" href="../../Styles/Professor/ListClasses.css">
        <link rel="stylesheet" href="../../Styles/Professor/ListEtudiants.css">
        <link rel="stylesheet" href="../../Styles/Professor/Setting.css">
        <link rel="stylesheet" href="../../Styles/Professor/Seances.css">
        <link rel="stylesheet" href="../../Styles/Professor/Statistiques.css">
    <?php 
        } else if($role == 'etudiant') {
    ?>
        <link rel="stylesheet" href="../../Styles/Etudiant/Header.css">v
        <link rel="stylesheet" href="../../Styles/Etudiant/settings.css">
        <link rel="stylesheet" href="../../Styles/Etudiant/home.css">

    <?php } ?>

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
            <?php if($role == 'professor') { ?>
                <li class="list active">
                    <button id="liste-classes-btn">
                        <svg class="icon" viewBox="0 0 35 31" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0 4.42857C0 1.98594 1.96191 0 4.375 0H30.625C33.0381 0 35 1.98594 35 4.42857V26.5714C35 29.0141 33.0381 31 30.625 31H4.375C1.96191 31 0 29.0141 0 26.5714V4.42857ZM4.375 8.85714V26.5714H15.3125V8.85714H4.375ZM30.625 8.85714H19.6875V26.5714H30.625V8.85714Z" />
                        </svg>
                        <div class="text">Liste d'absence</div>
                    </button>
                </li>
                <li class="list ">
                    <button id="statistique-btn">
                        <i class="fas fa-chart-pie"></i>
                        <div class="text">Statistiques</div>
                    </button>
                </li>
            <?php } ?>
            <?php if($role == 'etudiant') { ?>
                <li class="list active">
                    <button id="home-btn">
                        <i class="awesome-icon fas fa-home"></i>
                        <div class="text">Accueil</div>
                    </button>
                </li>
            <?php } ?>
            
            <li class="list">
                <button id="parametre-btn">
                    <svg class="icon" viewBox="0 0 35 33" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3321 30.4788C10.9201 29.7587 8.73557 28.4263 6.99127 26.6113C7.55249 25.9457 7.90234 25.1278 7.99606 24.2622C8.08977 23.3966 7.92308 22.5227 7.51732 21.7523C7.11157 20.982 6.48519 20.3503 5.71836 19.938C4.95152 19.5256 4.0791 19.3515 3.21273 19.4378C3.01536 18.471 2.91617 17.4867 2.91669 16.5C2.91669 14.976 3.15002 13.506 3.58461 12.125H3.64586C4.38943 12.1252 5.12079 11.936 5.77089 11.575C6.42099 11.2141 6.96837 10.6934 7.36135 10.0622C7.75432 9.43093 7.97993 8.70994 8.01686 7.96729C8.05379 7.22463 7.90083 6.48482 7.57242 5.8177C9.28202 4.2258 11.3495 3.06862 13.6004 2.44385C13.9668 3.1631 14.5249 3.76699 15.2131 4.18871C15.9014 4.61042 16.6929 4.83353 17.5 4.83333C18.3072 4.83353 19.0987 4.61042 19.7869 4.18871C20.4751 3.76699 21.0333 3.1631 21.3996 2.44385C23.6505 3.06862 25.718 4.2258 27.4276 5.8177C27.0968 6.48949 26.944 7.23494 26.9837 7.98271C27.0235 8.73048 27.2545 9.45552 27.6547 10.0884C28.0548 10.7214 28.6108 11.241 29.2692 11.5976C29.9277 11.9542 30.6667 12.1358 31.4154 12.125C31.8595 13.5408 32.0847 15.0162 32.0834 16.5C32.0834 17.5062 31.9813 18.4892 31.7873 19.4385C30.9209 19.3522 30.0485 19.5264 29.2817 19.9387C28.5149 20.351 27.8885 20.9827 27.4827 21.7531C27.077 22.5234 26.9103 23.3973 27.004 24.2629C27.0977 25.1285 27.4475 25.9464 28.0088 26.6121C26.2644 28.4268 24.0799 29.7589 21.6679 30.4788C21.3847 29.596 20.8285 28.826 20.0794 28.2796C19.3303 27.7333 18.4272 27.4389 17.5 27.4389C16.5729 27.4389 15.6697 27.7333 14.9206 28.2796C14.1716 28.826 13.6153 29.596 13.3321 30.4788Z" stroke-width="4" stroke-linejoin="round"/>
                        <path d="M17.5 21.6042C18.1703 21.6042 18.8341 21.4722 19.4533 21.2157C20.0726 20.9592 20.6353 20.5832 21.1092 20.1092C21.5832 19.6353 21.9592 19.0726 22.2157 18.4533C22.4722 17.8341 22.6042 17.1703 22.6042 16.5C22.6042 15.8298 22.4722 15.166 22.2157 14.5468C21.9592 13.9275 21.5832 13.3648 21.1092 12.8909C20.6353 12.4169 20.0726 12.0409 19.4533 11.7844C18.8341 11.5279 18.1703 11.3959 17.5 11.3959C16.1463 11.3959 14.8481 11.9336 13.8909 12.8909C12.9336 13.8481 12.3959 15.1463 12.3959 16.5C12.3959 17.8537 12.9336 19.152 13.8909 20.1092C14.8481 21.0664 16.1463 21.6042 17.5 21.6042Z" stroke="white" stroke-width="4" stroke-linejoin="round"/>
                    </svg>
                    <div class="text">Paramètre</div>
                </button>
            </li>
            <?php if($role == 'professor') { ?>
                <li class="list">
                    <button id="seance-btn">
                        <svg class="icon" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.4127 0.287109C17.0827 -0.0957031 17.9098 -0.0957031 18.5866 0.287109L30.3307 6.99316L30.6247 7.10938V7.1709L33.8991 9.04395C34.7604 9.53613 35.1842 10.5479 34.9313 11.5049C34.6784 12.4619 33.8102 13.1318 32.819 13.1318H2.18716C1.19595 13.1318 0.327782 12.4619 0.0748519 11.5049C-0.178078 10.5479 0.24575 9.53613 1.10708 9.04395L4.37466 7.1709V7.10938L4.67544 7L16.4127 0.287109ZM4.37466 15.3125H8.74966V28.4375H11.484V15.3125H15.859V28.4375H19.1403V15.3125H23.5153V28.4375H26.2497V15.3125H30.6247V28.7314C30.6657 28.752 30.7067 28.7793 30.7477 28.8066L34.029 30.9941C34.8288 31.5273 35.1911 32.5254 34.9108 33.4482C34.6305 34.3711 33.776 35 32.8122 35H2.18716C1.22329 35 0.375633 34.3711 0.0953597 33.4482C-0.184914 32.5254 0.170555 31.5273 0.977196 30.9941L4.25845 28.8066C4.29946 28.7793 4.34048 28.7588 4.38149 28.7314V15.3125H4.37466Z" />
                        </svg>                        
                        <div class="text">Séances</div>
                    </button>
                </li>
            <?php } ?>
            <div class="indicator">
                <dic class="circle"></div>
            </div>
        </ul>
    </nav>
    <div class="alerts-container"></div>