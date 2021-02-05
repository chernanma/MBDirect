import WebRTCPeerConnection from "./webrtc-peerConnection";
import SignalingChannel from "./webrtc-signalingChannel";
import WebRTCUserMedia from "./webrtc-userMedia";
import peerConConfig from "./webrtc-config";
import API from "../API";

class Meap {
    constructor(userMediaConstraints) {
        this.uid = Math.floor(Math.random() * 10 + 1);
        this.userId = null;
        this.roomId = null;
        this.businessId = null;
        this.startTime = Date.now();
        this.pcs = {};
        this.signalingChannel = null;
        this.userMedia = null;
        this.isCallee = null;
        this.userMediaConstraints = userMediaConstraints;
        this.selfiCam = null;
        this.remoteCam = null;
        this.onerrorCB = null;
    }

    init() {

        if (!this.userId || !this.businessId || !this.roomId) {
            throw new Error(`Provide Info: userId: ${this.userId && true}, businessId: ${this.businessId && true}, roomId: ${this.roomId && true}`)
        }

        console.log("userId : " + this.userId);
        console.log("roomId : " + this.roomId);
        console.log("callee: " + this.isCallee);
        console.log("initializing meetingroom");

        if (this.signalingChannel) {
            return;
        }

        Promise.all([
            this.createSocketConnection(),
            this.joinSocketRoom(),
            this.setupUserMedia()
        ])
        .then(
                (fulfillment) => {
                    console.log("setup was successfull");
                },
                (rejection) => {
                    this.leaveRoom();
                }
            );
    }

    /** SignalChannel */
    createSocketConnection() {
        console.log("creating Socket Connection");
        return new Promise((resolve, reject) => {
            if (this.signalingChannel && this.signalingChannel.socket) {
                console.log("have socket connection");
                resolve();
            }
            try {
                this.signalingChannel = new SignalingChannel("ws://127.0.0.1:3001",
                    this.handleSignalError,
                    this.incomingSignalMessage
                );
                this.signalingChannel.open();
                console.log(this.signalingChannel);
                console.log("creating Socket Connection: successfull");
                resolve();
            } catch (e) {
                console.log("Erro while creating signal channel");
                reject();
            }
        });
    }

    closeSocketConnection() {
        console.log(this.signalingChannel);
        if (!this.signalingChannel) {
            return;
        }
        this.signalingChannel.close();
        this.signalingChannel = null;
    }

    joinSocketRoom() {
        return new Promise((resolve, reject) => {
            if (this.roomId === "") {
                this.onerror("need roomId to load the socket");
                reject();
            }

            if (!(this.signalingChannel && this.signalingChannel.socket)) {
                this.onerror("socket connection hasn't been established");
                reject();
            }

            console.log("connecting to the socket room");

            this.signalingChannel.connectToRoom(this.roomId, this.userId);
            resolve();
        });

    }

     /** peer Connection */
     createPeerConnection(params, remoteUserId = "NO_ID") {
        console.log("creating peer connection");
        const cb = {
            errorHandler: this.handleError,
            remoteStreamHandler: this.remoteStreamHandler.bind(this),
            signalHandler: this.sendSignalMessage.bind(this),
        }
        let pc = {
            con: new WebRTCPeerConnection({ ...params, ...cb }),
            remoteUserId: remoteUserId,
        };

        console.log(this.userMedia);
        console.log(this.userMedia.getLocalStream());
        pc.con.addLocalStream(this.userMedia.getLocalStream());
        // save the pc to pcs collection
        this.pcs[remoteUserId] = pc;
        console.log(this.pc);
        console.log(this.pcs);
        console.log("created peer connection");

    }

    closePeerConnection() {
        if (!this.pcs) {
            return;
        }

        console.log(this.pcs);

        Object.keys(this.pcs).forEach(key => {
            this.pcs[key].con.close();
        });
        this.pcs = {};
    }

    setupPeerConnection({ userId, data }) {

        if (Object.keys(this.pcs).length <= 0) {
            console.log("No existing connection so new connection was found")
            this.createPeerConnection(peerConConfig);
            if (this.pcs && this.pcs["NO_ID"]) {
                let pc = this.pcs["NO_ID"];
                delete this.pcs["NO_ID"];
                console.log(this.pcs);
                pc.remoteUserId = userId;
                pc.polite = !data.polite;
                this.pcs[userId] = pc;

                if (!this.pcs[userId].con.localStream) {
                    this.pcs[userId].con.addLocalStream(this.userMedia.getLocalStream());
                }
                this.pcs[userId].con.receivedMessageFromSignaler(data.peerData);
            }
        } else if (this.pcs && this.pcs[userId]) {
            console.log("FOund user with id: " + userId);
            if (!this.pcs[userId].con.localStream) {
                this.pcs[userId].con.addLocalStream(this.userMedia.getLocalStream());
            }
            this.pcs[userId].con.receivedMessageFromSignaler(data.peerData);
        } else if (this.pcs && this.pcs["NO_ID"]) {

            console.log(`polite: ${data.polite}, startTime: ${data.startTime}`);

            let bePolite = this.pcs["NO_ID"].con.startTime > data.startTime;
            this.pcs["NO_ID"].con.polite = bePolite;
            this.pcs["NO_ID"].remoteUserId = userId;
            let pc = this.pcs["NO_ID"];
            delete this.pcs["NO_ID"];
            this.pcs[userId] = pc;


            console.log(`changed NO_ID to : ${userId} and bePolite: ${this.pcs[userId].polite}`);
            console.log(this.pcs);

            if (!this.pcs[userId].con.localStream) {
                this.pcs[userId].con.addLocalStream(this.userMedia.getLocalStream());
            }
            this.pcs[userId].con.receivedMessageFromSignaler(data.peerData)
        }

    }

    connectToPeers() {
        console.log("connecting to peer");
        console.log("creating NO_ID peer connection");

        this.createPeerConnection(peerConConfig);

        if (this.pcs && this.pcs["NO_ID"]) {
            console.log("starting call");
            this.pcs["NO_ID"].con.startCall();
            console.log("started Peer Connection");
        } else {
            console.log("no pcs connections");
        }
    }

    
}

const meets = new Meap({audio: true, video: true});

export default meets;