import random
import time
import  sys
from  Adafruit_IO import  MQTTClient
import serial.tools.list_ports
import pymongo
import datetime
from dotenv import dotenv_values

config = dotenv_values(".env")
AIO_FEED_IDS=config.get("AIO_FEED_IDS").split(",")
AIO_USERNAME=config.get("AIO_USERNAME")
AIO_KEY=config.get("AIO_KEY")
myclient = pymongo.MongoClient("mongodb+srv://"+config.get("DATABASE_USERNAME")+":"+config.get("DATABASE_PASSWORD")+"@cluster0.mpdyonk.mongodb.net/")
mydb = myclient["CMS"]
mycol = mydb["Users"]
mydoc=mycol.find_one({"username":"rang","password":"rang"})
def  connected(client):
    print("Kết nối thành công")
    for feed in AIO_FEED_IDS:
        client.subscribe(feed)

def  subscribe(client , userdata , mid , granted_qos):
    print("Đăng ký thành công")

def  disconnected(client):
    print("Ngắt kết nối")
    sys.exit (1)

def  message(client , feed_id , payload):
    print("Nhận dữ liệu: " + payload +" ở thiết bị "+feed_id)
    if feed_id=="cambienanhsang":
        mydb["LightSensors"].insert_one({"userID":mydoc['_id'],"data":float(payload),"Date":datetime.datetime.now()})
        mydb["Logs"].insert_one({"userID":mydoc['_id'],"activity":("Nhập dữ liệu "+ payload +" vào LightSensors"),"Date":datetime.datetime.now()})
    if feed_id=="cambiendoamdat":
        mydb["MoistureSensors"].insert_one({"userID":mydoc['_id'],"data":float(payload),"Date":datetime.datetime.now()})
        mydb["Logs"].insert_one({"userID":mydoc['_id'],"activity":("Nhập dữ liệu "+ payload +" vào MoistureSensors"),"Date":datetime.datetime.now()})
    if feed_id=="cambiennhietdo":
        mydb["TemperatureSensors"].insert_one({"userID":mydoc['_id'],"data":float(payload),"Date":datetime.datetime.now()})
        mydb["Logs"].insert_one({"userID":mydoc['_id'],"activity":("Nhập dữ liệu "+ payload +" vào TemperatureSensors"),"Date":datetime.datetime.now()})
    if feed_id=="cambiendoam":
        mydb["HumiditySensors"].insert_one({"userID":mydoc['_id'],"data":float(payload),"Date":datetime.datetime.now()})
        mydb["Logs"].insert_one({"userID":mydoc['_id'],"activity":("Nhập dữ liệu "+ payload +" vào HumiditySensors"),"Date":datetime.datetime.now()})
    if feed_id=="maybom1":
        mydb["WaterPumps"].insert_one({"userID":mydoc['_id'],"data":payload,"Date":datetime.datetime.now()})
        mydb["Logs"].insert_one({"userID":mydoc['_id'],"activity":("Nhập dữ liệu "+ payload +" vào WaterPumps"),"Date":datetime.datetime.now()})
    if isMicrobitConnected:
        ser.write((str(payload) + "#").encode())

client = MQTTClient(AIO_USERNAME , AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()
def getPort():
    ports = serial.tools.list_ports.comports()
    N = len(ports)
    commPort = "None"
    for i in range(0, N):
        port = ports[i]
        strPort = str(port)
        if "Hello" in strPort:
            splitPort = strPort.split(" ")
            commPort = (splitPort[0])
    return commPort
isMicrobitConnected = False
if getPort() != "None":
    ser = serial.Serial( port=getPort(), baudrate=115200)
    isMicrobitConnected = True

def processData(data):
    data = data.replace("!", "")
    data = data.replace("#", "")
    splitData = data.split(":")
    print(splitData)
    try:
        temperature,roomhumidity,soilmoisture,
        if splitData[1] == "TEMP":
            client.publish("cambiennhietdo", splitData[2])
        elif splitData[2] == "HUMI":
            client.publish("cambiendoam", splitData[3])
    except:
        pass
mess = ""
def readSerial():
    bytesToRead = ser.inWaiting()
    if (bytesToRead > 0):
        global mess
        mess = mess + ser.read(bytesToRead).decode("UTF-8")
        while ("#" in mess) and ("!" in mess):
            start = mess.find("!")
            end = mess.find("#")
            processData(mess[start:end + 1])
            if (end == len(mess)):
                mess = ""
            else:
                mess = mess[end+1:]

while True:
    if isMicrobitConnected:
        readSerial()

    time.sleep(1)