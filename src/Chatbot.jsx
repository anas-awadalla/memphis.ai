import React from "react";
import "@progress/kendo-theme-default/dist/all.css";
import { Chat } from "@progress/kendo-react-conversational-ui";
import "whatwg-fetch";
import CodeContainer from "./pythonCode";
import { AwesomeButton } from "react-awesome-button";
import Modules from "react-awesome-button/demo/helpers/modules";
import ProgressBar from "react-bootstrap/ProgressBar";
import logo from "./logo.jpg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import notebookBuilder from "./notebookBuilder";

export default class Chatbot extends React.Component {
  constructor(props) {
    super(props);
    this.user = false;
    this.notebook = new notebookBuilder();
    this.bot = { id: "0", name: "bot" };
    this.progress = "task";
    this.state = {
      messages: [
        {
          author: this.bot,
          timestamp: new Date(),
          text:
              "Welcome to Memphis.AI! Let me know what ML task you want to tackle. Currently I support image classification!",
        },
      ],
      chatbotStatus: "",
      code: "  ",
      progressBar: 0,
    };
  }

  handleCode() {
    console.log("here");
    if (this.state.chatbotStatus === "image classification") {
      console.log("here");
      this.notebook.addImports();
      this.setState({ code: this.notebook.get_notebook(), progressBar: 25 });
    } else if (this.state.chatbotStatus === "resnet") {
      this.notebook.addPretrainedNetworkFinetune();
      this.setState({
        code:  "\n"+ this.notebook.get_notebook(),
        progressBar: 50
      });
    } else if (this.state.chatbotStatus === "vgg") {
      this.setState({
        code: "\n model.addVGG()",
        progressBar: 75,
      });
    } else if (this.state.chatbotStatus === "adam") {
      this.notebook.addOptimizer();
      this.setState({
        code: "\n" + this.notebook.get_notebook(),
        progressBar: 75,
      });
    } else if (this.state.chatbotStatus === "sgd") {
      this.setState({
        code: "\n model.addSGD()",
        progressBar: 90,
      });
    } else if (this.progress === "done") {
      this.notebook.addtrainingcode();
      this.setState({
        code: this.notebook.get_notebook() +"\n # your code is ready to run",
        progressBar: 100,
      });
    }
  }

  addMessage = async ({ message }) => {
    if (!this.user) {
      // this.user = { name: message.text, id: Date.now().toString() };
      fetch(
          `https://hack20.cognitiveservices.azure.com/luis/prediction/v3.0/apps/bea8d2f9-d110-4d2d-a7d8-97982dc213f7/slots/production/predict?subscription-key=002a0893797a45eabfa474b31c352340&verbose=true&show-all-intents=true&log=true&query=${message.text}`
      )
          .then((res) => res.json())
          .then((json) => {
            // console.log(json)
            let newMessage = {
              text: "",
              author: this.bot,
              id: Date.now().toString(),
            };
            let intent = json.prediction.topIntent;
            if (intent === "questions") {
              fetch(
                  "https://torched20.azurewebsites.net/qnamaker/knowledgebases/303cbe59-ac9f-457b-bbeb-8de09b0bd1dc/generateAnswer",
                  {
                    body: "{'question':'what is relu?'}",
                    headers: {
                      Authorization:
                          "EndpointKey e3726841-6018-4fdf-8f42-a808b68b848c",
                      "Content-Type": "application/json",
                    },
                    method: "POST",
                  }
              )
                  .then((res) => res.json())
                  .then(async (json) => {
                    console.log(json.answers[0].answer);
                    this.text = json.answers[0].answer;
                  });

              this.setState({
                messages: [
                  ...this.state.messages,
                  {
                    author: { name: "You", id: Date.now().toString() },
                    timestamp: new Date(),
                    text: message.text,
                  },
                  {
                    author: newMessage.author,
                    timestamp: new Date(),
                    text: "ReLU (or Rectified Linear Unit) is the most widely used activation function. It gives an output of X if X is positive and zeroes otherwise. ReLU is often used for hidden layers.",
                  },
                ],
              });
              this.handleCode();
            } else {
              if (this.progress === "task") {
                if (intent === "Image Classification") {
                  newMessage.text =
                      "Image classification sounds like a great idea, let's get started!";
                  this.progress = "model";
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                      {
                        author: this.bot,
                        timestamp: new Date(),
                        text:
                            "Ok going forward you can ask me questions about deep learning concepts like \" What is Relu? '",
                      },
                    ],
                    chatbotStatus: "image classification",
                  });
                  this.handleCode();
                } else {
                  newMessage.text =
                      'We currently don\'t support this functionality. Try something like "run image classification"';
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                    ],
                    chatbotStatus: "",
                  });
                }
                //this.handleCode();
              } else if (this.progress === "model") {
                if (intent === "resnet") {
                  newMessage.text = "I agree ResNet could be a great option";
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                    ],
                    chatbotStatus: "resnet",
                  });
                  this.progress = "optimizer";
                  this.handleCode();
                } else if (intent === "vgg") {
                  newMessage.text = "I agree VGG could be a great option";
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                    ],
                    chatbotStatus: "vgg",
                  });
                  this.progress = "optimizer";
                  //this.handleCode();
                } else {
                  newMessage.text =
                      'We currently don\'t support this model type. Try something like "use a resnet model"';
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                    ],
                    chatbotStatus: "",
                  });
                  this.handleCode();
                }
              } else if (this.progress === "optimizer") {
                if (intent === "Adam") {
                  newMessage.text = "I agree adam could be a great option";
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                    ],
                    chatbotStatus: "adam",
                  });
                  this.progress = "learningRate";
                  this.handleCode();
                } else if (intent === "sgd") {
                  newMessage.text = "I agree sgd could be a great option";
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                    ],
                    chatbotStatus: "sgd",
                  });
                  this.progress = "learningRate";
                  //this.handleCode();
                } else {
                  newMessage.text =
                      'We currently don\'t support this type of optimizer. Try something like "use an adam optimizer"';
                  this.setState({
                    messages: [
                      ...this.state.messages,
                      {
                        author: { name: "You", id: Date.now().toString() },
                        timestamp: new Date(),
                        text: message.text,
                      },
                      {
                        author: newMessage.author,
                        timestamp: new Date(),
                        text: newMessage.text,
                      },
                    ],
                    chatbotStatus: "",
                  });
                  this.handleCode();
                }
              } else {
                if (this.progress === "task") {
                  if (intent === "Image Classification") {
                    newMessage.text =
                        "Image classification sounds like a great idea, let's get started!";
                    this.progress = "model";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                        {
                          author: this.bot,
                          timestamp: new Date(),
                          text:
                              "Ok going forward you can ask me questions about deep learning concepts like \" What is Relu? '",
                        },
                      ],
                    });
                  } else {
                    newMessage.text =
                        'We currently don\'t support this functionality. Try something like "run image classification"';
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                  }
                } else if (this.progress === "model") {
                  if (intent === "resnet") {
                    newMessage.text = "I agree ResNet could be a great option";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                    this.progress = "model_training";
                  } else if (intent === "vgg") {
                    newMessage.text = "I agree VGG could be a great option";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                    this.progress = "model_training";
                  } else {
                    newMessage.text =
                        'We currently don\'t support this model type. Try something like "use a resnet model"';
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                  }
                } else if (this.progress === "model_training") {
                  if (intent === "retrain") {
                    newMessage.text =
                        "Sounds good, retraining is usually reserved for larger datasets so keep that in mind!";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                    this.progress = "optimizer";
                  } else if (intent === "finetune") {
                    newMessage.text =
                        "Sounds good...finetuning should yield promising results";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                    this.progress = "optimizer";
                  } else if (intent === "feature extraction") {
                    newMessage.text =
                        "Cool for a smaller dataset feature extraction will yield promising results";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                    this.progress = "optimizer";
                  } else {
                    newMessage.text =
                        'Please choose to either retrain or finetune or do feature extraction. Try something like "finetune the model"';
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                  }
                } else if (this.progress === "optimizer") {
                  if (intent === "Adam") {
                    newMessage.text = "I agree adam could be a great option";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                    this.progress = "learningRate";
                  } else if (intent === "sgd") {
                    newMessage.text = "I agree sgd could be a great option";
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                    this.progress = "learningRate";
                  } else {
                    newMessage.text =
                        'We currently don\'t support this type of optimizer. Try something like "use an adam optimizer"';
                    this.setState({
                      messages: [
                        ...this.state.messages,
                        {
                          author: { name: "You", id: Date.now().toString() },
                          timestamp: new Date(),
                          text: message.text,
                        },
                        {
                          author: newMessage.author,
                          timestamp: new Date(),
                          text: newMessage.text,
                        },
                      ],
                    });
                  }
                }
              }
            }
            // this.setState({
            //   messages: [...this.state.messages, {author:newMessage.author,timestamp:new Date(),text:newMessage.text}, {author:this.bot,timestamp:new Date(),text:"Ok going forward you can ask me questions about deep learning concepts like \" What is Relu? \'"}],
            // });
          });
    } else {
      //TODO: Send message across the channel
    }
  };

  render() {
    return (
        <div>
          <ToastContainer />
          <div class="row" style={{ paddingLeft: 10 }}>
            <img src={logo} style={{ padding: 25 }} alt="Memphis.AI" />
          </div>
          <text
              style={{ color: "white", padding: 14, fontFamily: "Helvetica Neue" }}
          >
            {/* {"Progress: "} */}
          </text>
          <div class="row" style={{ paddingLeft: 30 }}>
            <ProgressBar
                animated
                variant="info"
                now={this.state.progressBar}
                style={{ width: "95%" }}
            />

            <div class="column" style={{ padding: 20, height: "100%" }}>
              <h1 style={{ color: "white" }}>Memphis ML Code Assistant </h1>
              <Chat
                  user={this.user}
                  messages={this.state.messages}
                  onMessageSend={this.addMessage}
                  placeholder={"Type here..."}
                  width={400}
              ></Chat>
            </div>

            <div class="column"></div>
            <div class="column" style={{ padding: 20 }}>
              <CodeContainer code={this.state.code} />
              <AwesomeButton
                  cssModule={Modules.Modules["Cartman"]}
                  type="secondary"
                  onPress={() => {
                    navigator.clipboard.writeText(this.state.code);
                    toast("Copied to clipboard!");
                  }}
              >
                Copy Code
              </AwesomeButton>
            </div>
          </div>
        </div>
    );
  }
}
