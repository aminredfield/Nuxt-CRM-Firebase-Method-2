# **ПРОМПТ ДЛЯ ВТОРОГО ВАРИАНТА**

> Во втором варианте нужно выполнить те же 10 пунктов, но другим подходом фронт вообще не обращается к firestore напрямую. Весь crud по projects/clients/tasks, relation и выборки по reverse index выполняются через httpsCallable, а обновление projectTaskIndex и clientTaskIndex вынесено в сами функции upsertTask/deleteTask и firestore триггер onTaskWrite. Структура /frontend + /modules, layout и меню остаются такими же , функционал как в первом варианте, но вся работа с данными идёт только через callable функции.


