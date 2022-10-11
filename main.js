const { app, BrowserWindow } = require('electron');
const electron = require('electron');
const path = require('path');
const fs = require('fs');

//------------------------------------------------------------------------------// 
const Menu = electron.Menu;
const Tray = electron.Tray;

var appTray = null;
let win;
let windowConfig = {
    width: 800,
    height: 600,
    skipTaskbar: true
};
function createWindow() {

    win = new BrowserWindow(windowConfig); // создаем само окно
    //проверка на файл
    try {
        if (fs.existsSync("test.txt", "utf-8")) {
            win.hide();
        } else {
            win.show();
            fs.open('./test.txt', "w", (err) => {
                if (err) throw err;
                console.log('Создал файл test.txt')})
        }
    } catch (e) {
        console.log(e);
    }
//принимает верстку на коно 
    win.loadURL(`file://${__dirname}/index.html`);
    // Открываем инструмент отладки  
    win.webContents.openDevTools();

    //создаем создаем форму контекстного меню 
    var trayMenuTemplate = [
        {
            label: "Открыть",
            click: function () {
                win.show();
            } // Открываем соответствующую страницу
        },
        {
            label: 'Помощь',
            click: function () { }
        },
        {
            label: "О нас",
            click: function () { }
        },
        {
            label: "Выход",
            click: function () {
                app.quit();
                app.quit();
            }
        }
    ];

    trayIcon = path.join(__dirname, 'app');
    //создаем иконку и прицепляем на неё картинку
    appTray = new Tray(path.join(trayIcon, 'app.ico'));

    //создание контекстного меню
    const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);


    appTray.setToolTip('Steelcom');
    // Контекстное меню на ПКМ
    appTray.setContextMenu(contextMenu);

    //Контекстное меню на ЛКМ
    appTray.on('click', (e) => {
        appTray.popUpContextMenu(contextMenu)
    })
    //Открытие окна двойным кликом
    appTray.on('double-click', (e) => {
        win.show()
    })
    //Функция закрытия окна 
    win.on('close', (e) => {

        if (win.isMinimized()) {
            win = null;
        } else {
            e.preventDefault();
            win.minimize();
        }

    });

}
//Дефолтные функции electron
app.on('ready', createWindow);
app.on('window-all-closed', () => {
    app.quit();
});

app.on('activate', () => {
    if (win == null) {

        createWindow();
    }
})

