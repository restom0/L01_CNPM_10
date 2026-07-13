import time
import sys
from Adafruit_IO import MQTTClient
import serial.tools.list_ports
import pymongo
import datetime
from dotenv import dotenv_values

config = dotenv_values(".env")
DATA_IMPORT_PREFIX = "Nhập dữ liệu"
AIO_FEED_IDS = ["cambienanhsang", "cambiendoamdat", "cambiennhietdo", "cambiendoam", "maybom1", "maybom2"]
AIO_USERNAME = config.get("AIO_USERNAME")
AIO_KEY = config.get("AIO_KEY")
database_uri = (
    "mongodb+srv://"
    + config.get("DATABASE_USERNAME")
    + ":"
    + config.get("DATABASE_PASSWORD")
    + "@cluster0.mpdyonk.mongodb.net/"
)
mongo_client = pymongo.MongoClient(database_uri)
database = mongo_client["CMS"]
users_collection = database["users"]
user_filter = {"username": config.get("CMS_USERNAME")}
if config.get("CMS_PASSWORD"):
    user_filter["password"] = config.get("CMS_PASSWORD")
current_user = users_collection.find_one(user_filter)


def connected(client):
    print("Kết nối thành công")
    for feed in AIO_FEED_IDS:
        client.subscribe(feed)


def subscribe(client, userdata, mid, granted_qos):
    print("Đăng ký thành công")


def disconnected(client):
    print("Ngắt kết nối")
    sys.exit(1)


def log_sensor_value(collection_name, payload, numeric=True):
    value = float(payload) if numeric else payload
    now = datetime.datetime.now()
    database[collection_name].insert_one({"userID": current_user["_id"], "data": value, "Date": now})
    database["logs"].insert_one({
        "userID": current_user["_id"],
        "activity": f"{DATA_IMPORT_PREFIX} {payload} vào {collection_name}",
        "Date": now,
    })


def message(client, feed_id, payload):
    print("Nhận dữ liệu: " + payload + " ở thiết bị " + feed_id)
    feed_collections = {
        "cambienanhsang": ("lightsensors", True),
        "cambiendoamdat": ("moisturesensors", True),
        "cambiennhietdo": ("temperaturesensors", True),
        "cambiendoam": ("humiditysensors", True),
        "maybom1": ("waterpumps", False),
    }
    if feed_id in feed_collections and current_user:
        collection_name, numeric = feed_collections[feed_id]
        log_sensor_value(collection_name, payload, numeric)
    if is_microbit_connected:
        serial_connection.write((str(payload) + "#").encode())

client = MQTTClient(AIO_USERNAME, AIO_KEY)
client.on_connect = connected
client.on_disconnect = disconnected
client.on_message = message
client.on_subscribe = subscribe
client.connect()
client.loop_background()
def get_port():
    ports = serial.tools.list_ports.comports()
    comm_port = "None"
    for port in ports:
        str_port = str(port)
        if "Hello" in str_port:
            split_port = str_port.split(" ")
            comm_port = split_port[0]
    return comm_port


is_microbit_connected = False
microbit_port = get_port()
if microbit_port != "None":
    serial_connection = serial.Serial(port=microbit_port, baudrate=115200)
    is_microbit_connected = True


def process_data(data):
    data = data.replace("!", "")
    data = data.replace("#", "")
    split_data = data.split(":")
    print(split_data)
    try:
        if split_data[1] == "TEMP":
            client.publish("cambiennhietdo", split_data[2])
        elif split_data[2] == "HUMI":
            client.publish("cambiendoam", split_data[3])
    except (IndexError, ValueError):
        pass


mess = ""


def read_serial():
    bytes_to_read = serial_connection.inWaiting()
    if bytes_to_read > 0:
        global mess
        mess = mess + serial_connection.read(bytes_to_read).decode("UTF-8")
        while ("#" in mess) and ("!" in mess):
            start = mess.find("!")
            end = mess.find("#")
            process_data(mess[start:end + 1])
            if end == len(mess):
                mess = ""
            else:
                mess = mess[end + 1:]

while True:
    if is_microbit_connected:
        read_serial()

    time.sleep(1)
