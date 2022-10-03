# Skiptocyte.com: Medical laboratory tools
A website with tools for laboratory professionals. The main tool is the "cell counter" which is an advanced tallying tool. It helps laboratory technologists keep track of the cells they see under a microscope to determine their quantities and ratios and then print the report. It can be ran locally or seen at https://www.skiptocyte.com

<b>In order to run it locally, download the src file and open the index.html page. It should open and run fine without any running server.</b>

This application was built using HTML, CSS and vanilla Javascript. No frontend framework was used. There is no back-end or connection to a database so the entire application can be ran locally without installing any libraries or modules. Presets are saved to local storage.

According to Google Analytics, the site traffic is increasing with dozens of daily active users from all over the world.

<img src="https://github-media.s3.amazonaws.com/Screenshot+2022-10-01+190217.png" width="800" />
<br>
[data snapshot from 10/1/2022]


## Cell Counter Features
* Add rows using the "Add" button
* Drag and drop table rows to change the order
* Create, update and save new presets for future use
* Each cell can be mapped to a key on the keyboard. If the key is on the number pad, it will show up on the right panel. But any key on the keyboard can be used
* <b> When you hit the key that is mapped on the table, the numpad flashes to indicate that it was clicked and the count goes up</b>
* Counter will keep going up to the max count. A audible "ding" is heard when the maximum count is reached.
* A report can be printed by click the "print" button
* This application also responsive and works in mobile. Tapping the squares on the numpad replaces keyboard clicks in the mobile version


[Website demo](https://github-media.s3.amazonaws.com/skiptocyte(1).gif)
<img alt="website demonstration" src="https://github-media.s3.amazonaws.com/skiptocyte(1).gif" width="1000" />
