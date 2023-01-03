# Car model identifier

This project is splitted into three parts:
- [Gathering images](#gathering-images)
- [Training the model](#training-the-model)
- [Webserver](#webserver)

## Gathering images
For this part, we are using the Playwright from Microsoft to go over a website and download some images with label from there.
This project will create two files and one folder.
The files are CSV separated by comma. The timestamps in the name of the csv files and the folder will be the same as the timestamp of the begening of execution.
- `filter-links-{timestamp}.csv` columns:
  - `{maker}_{model}`
  - The link to this filter
- `models-links-{timestamp}.csv` columns:
  - Maker
  - Model
  - The link for each item anounced on the first page
- `images/{timestamp}` folder with subfolders:
  - `{maker}_{model}` This folder will have all images from this model saved as `{timestamp}.jpg` (in this case the timestamp is the current time so we don't overwrite other images).

The goal for this project is the folder with images all organized inside subfolders with the label of maker and model. The reason for the other files is to don't flood the memory and also if some step fail, you can continue from the previous file (you'll have to hardcode the `fileTimestamp` variable).

### Install the dependêncies for playwright
You can use node, yarn, or other tools to run javascript on the machine, but for this project we used [Bun](https://bun.sh).
It's currently on version `v0.4.0` and you can run the following command to install it.
```bash
curl -fsSL https://bun.sh/install | bash
```

With bun installed, you can go to the `playwright-cd` folder and install the project dependencies.

```bash
cd playwright-cd
bun install
```

### Execute the project:
```bash
bun start
```

## Training the model
This project depends on python, so make sure you have python installed on your machine.
As this project will use Jupyter, make sure to check the [installation guide](https://docs.jupyter.org/en/latest/install/notebook-classic.html) to check if you have the requirements. Right now the minimum python version is `3.3` and Jupyter recoments you install it using [Anaconda](https://www.anaconda.com/products/distribution).

### Install the dependencies for the Jupyter notebook
To install Anaconda, you can download it from this [link](https://www.anaconda.com/products/distribution).
This will already install the Jupyter notebook.
If you don't want to use Anaconda, you can install jupyter with python
```bash
pip3 install jupyter
```

### Execute the project

Before executing this you will need the images that you got in the previous step. Make sure you copied all the files and folders from `playwright-cd/images/{timestamp}/` to `training-jupyter/images/`.

Go to the project folder
```bash
cd training-jupyter
```

Start the jupyter server
```bash
jupyter notebook
```

After opening the project on the browser, go to the page `car_image_training.ipynb`.
The first thing you want to do is trusting the kernel, it's on top of the page, look for `kernel`.

After this, you can start executing it step-by-step, the shurtcut to execute is `shift+enter`.

The last step that you need to do is execute this line `learn.export()`, this will generate a file `export.pkl`, this is your trained model that you need to import on your webserver.

## Webserver

### Client
The client side is made with Vanilla JS, and used `bun` as the runtime envionment.

#### Install the dependencies
```bash
bun install
```

#### Run the project
```bash
bun start
```

## Server
The server is a Flask project
#### Install the dependencies
```bash
pip3 install -r requirements.txt
```

#### Run the project
```bash
python3 main.py
```