export default class notebookBuilder {
  constructor() {
    this.notebook = "# This is the Pytorch code for your model \n";
  }

  get_notebook() {
    return this.notebook;
  }

  addImports() {
    const imports =
      "import torch\n" +
      "import torchvision\n" +
      "from torchvision import transforms\n" +
      "import pandas as pd\n" +
      "import numpy as np\n" +
      "from torch.utils.data import Dataset, DataLoader\n\n\n";
    this.notebook = this.notebook + imports;
  }

  //hf = "Horizontal Flip"
  //vp = "Vertical Flip"

  addAugmentationsImage(text) {
    let result = "";
    if ("hp" in text) {
      result += "        transforms.RandomHorizontalFlip(),\n";
    }
    if ("vp" in text) {
      result += "        transforms.RandomVerticalFlip(),\n";
    }
    if ("randSize" in text) {
      result += "        transforms.RandomResizedCrop(224),\n";
    }

    return result;
  }

  addTransformationsImage(text) {
    const transform =
      "train_transform = transforms.Compose([\n" +
      "        transforms.Resize(256),\n";
    const toTensor =
      "        transforms.ToTensor(),\n" +
      "        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])])\n";

    this.notebook =
      this.notebook + transform + this.addAugmentationsImage("hf") + toTensor;
  }

  addDataloadersImage() {
    const dataloaders =
      "class dataset(Dataset):\n" +
      "\n" +
      "    def __init__(self, csv, transform=None):\n" +
      "          \n" +
      "\n" +
      "    def __len__(self):\n" +
      "        return len(self.dataArray)\n" +
      "\n" +
      "    def __getitem__(self, idx):\n" +
      "        return self.dataArray[idx], self.resultArray[idx]\n";
    this.notebook = this.notebook + dataloaders;
  }

  addPretrainedNetworkFinetune(netType) {
    const model =
      "model_ft = models.resnet18(pretrained=True)\n" +
        "num_ftrs = model_ft.fc.in_features\n" +
        "# Here the size of each output sample is set to 2.\n" +
        "# Alternatively, it can be generalized to nn.Linear(num_ftrs, len(class_names)).\n" +
        "model_ft.fc = nn.Linear(num_ftrs, num_classes)\n" +
        "\n" +
        "model_ft = model_ft.to(device)\n" +
        "\n" +
        "criterion = nn.CrossEntropyLoss()\n" +
        "\n" ;
    this.notebook += model;
  }

<<<<<<< HEAD
  addtrainingcode() {
    "";
  }
=======
  addOptimizer(){
    let optim =
        "# Observe that all parameters are being optimized\n" +
    "optimizer_ft = optim.SGD(model_ft.parameters(), lr=0.001, momentum=0.9)\n" +
    "\n" +
    "# Decay LR by a factor of 0.1 every 7 epochs\n" +
    "exp_lr_scheduler = lr_scheduler.StepLR(optimizer_ft, step_size=7, gamma=0.1)";

    this.notebook+=optim
  }

  addtrainingcode() {const train = "best_model_wts = copy.deepcopy(model.state_dict())\n" +
      "    best_acc = 0.0\n" +
      "\n" +
      "    for epoch in range(num_epochs):\n" +
      "        print('Epoch {}/{}'.format(epoch, num_epochs - 1))\n" +
      "        print('-' * 10)\n" +
      "\n" +
      "        # Each epoch has a training and validation phase\n" +
      "        for phase in ['train', 'val']:\n" +
      "            if phase == 'train':\n" +
      "                model.train()  # Set model to training mode\n" +
      "            else:\n" +
      "                model.eval()   # Set model to evaluate mode\n" +
      "\n" +
      "            running_loss = 0.0\n" +
      "            running_corrects = 0\n" +
      "\n" +
      "            # Iterate over data.\n" +
      "            for inputs, labels in dataloaders[phase]:\n" +
      "                inputs = inputs.to(device)\n" +
      "                labels = labels.to(device)\n" +
      "\n" +
      "                # zero the parameter gradients\n" +
      "                optimizer.zero_grad()\n" +
      "\n" +
      "                # forward\n" +
      "                # track history if only in train\n" +
      "                with torch.set_grad_enabled(phase == 'train'):\n" +
      "                    outputs = model(inputs)\n" +
      "                    _, preds = torch.max(outputs, 1)\n" +
      "                    loss = criterion(outputs, labels)\n" +
      "\n" +
      "                    # backward + optimize only if in training phase\n" +
      "                    if phase == 'train':\n" +
      "                        loss.backward()\n" +
      "                        optimizer.step()\n" +
      "\n" +
      "                # statistics\n" +
      "                running_loss += loss.item() * inputs.size(0)\n" +
      "                running_corrects += torch.sum(preds == labels.data)\n" +
      "            if phase == 'train':\n" +
      "                scheduler.step()\n" +
      "\n" +
      "            epoch_loss = running_loss / dataset_sizes[phase]\n" +
      "            epoch_acc = running_corrects.double() / dataset_sizes[phase]\n" +
      "\n" +
      "            print('{} Loss: {:.4f} Acc: {:.4f}'.format(\n" +
      "                phase, epoch_loss, epoch_acc))\n" +
      "\n" +
      "            # deep copy the model\n" +
      "            if phase == 'val' and epoch_acc > best_acc:\n" +
      "                best_acc = epoch_acc\n" +
      "                best_model_wts = copy.deepcopy(model.state_dict())\n" +
      "\n" +
      "        print()\n" +
      "\n" +
      "    time_elapsed = time.time() - since\n" +
      "    print('Training complete in {:.0f}m {:.0f}s'.format(\n" +
      "        time_elapsed // 60, time_elapsed % 60))\n" +
      "    print('Best val Acc: {:4f}'.format(best_acc))\n" +
      "\n" +
      "    # load best model weights\n" +
      "    model.load_state_dict(best_model_wts)"

      this.notebook += train}
>>>>>>> 3c675e66aea9e460661639cf53192e146aacd87c
}
