/**
 * Created by CHEN Hao for Vulture Egg Project
 * on 20-8-13.
 * EMail : iascchen@gmail.com
 */

// **************
// Render Setting
// **************

// "Color" : fill each area with solid color
// "Light" : simulate to render heat map of temperature by light.

RENDER_COLOR = "Color";
RENDER_LIGHT = "Light";
var render_type = RENDER_COLOR;
var temperature_max = 46 , temperature_min = 20;

// var colorMap = 'blackbody';
var colorMap = 'rainbow';
var numberOfColors = 512;

var isDrawEdgeLine = false;

// **************
// Environments Setting
// **************

var backcolor = 0xd9d9d9;

var edgecolor = 0xffffff;

ANGLE_LAYOUT = "Angle";
HEIGHT_LAYOUT = "Height";
AREA_LAYOUT = "Area";
var sensors_layout = AREA_LAYOUT;    // Temperature Sensor

// Calc this object center from obj file
OBJ_CENTER = {'y': 0, 'x': 0, 'z': 0};

MIN_Y = -0.845625;
MAX_Y = 1.479844;
HEIGHT_Y = MAX_Y - MIN_Y;


// **************
// Global Var
// **************

var m_object = null;
var m_mesh = null;

var samples_value = null;
var current_temperatures = null;
var current_position = null;

var lights = [];
var light_points = [];

var lut;

// **************
// Const
// **************

// Used by check face type

FACE_INDICES = ['a', 'b', 'c', 'd'];

SENSORS_NAME = ["temp_01", "temp_01", "temp_01", "temp_01", "temp_01",
    "temp_02", "temp_03", "temp_04", "temp_05", "temp_02",
    "temp_06", "temp_07", "temp_08", "temp_09", "temp_06",
    "temp_10", "temp_11", "temp_12", "temp_13", "temp_10",
    "temp_14", "temp_14", "temp_14", "temp_14", "temp_14"];

SAMPLE_VALUES = {"temp_01": 46,
    "temp_02": 44, "temp_03": 42, "temp_04": 40, "temp_05": 38,
    "temp_06": 36, "temp_07": 34, "temp_08": 32, "temp_09": 30,
    "temp_10": 28, "temp_11": 26, "temp_12": 24, "temp_13": 22,
    "temp_14": 20};

// **************
// Functions
// **************

function get_angle_lights_location(radius) {
    var r_adjust_1 = radius * 0.57 * 0.89,
        r_adjust_2 = radius * 0.58,
        r_adjust_3 = radius * 0.57 * 0.74,
        r_adjust_4 = radius * 0.58; // half_sqrt2 = 0.57

    var lights_location = [
        {'x': 0.0, 'y': radius, 'z': 0.0},

        {'x': r_adjust_1, 'y': r_adjust_1, 'z': 0.0},
        {'x': 0.0, 'y': r_adjust_1, 'z': r_adjust_1},
        {'x': -r_adjust_1, 'y': r_adjust_1, 'z': 0.0},
        {'x': 0, 'y': r_adjust_1, 'z': -r_adjust_1},

        {'x': r_adjust_2, 'y': 0.0, 'z': 0.0},
        {'x': 0.0, 'y': 0.0, 'z': r_adjust_2},
        {'x': -r_adjust_2, 'y': 0.0, 'z': 0.0},
        {'x': 0, 'y': 0.0, 'z': -r_adjust_2},

        {'x': r_adjust_3, 'y': -r_adjust_3, 'z': 0.0},
        {'x': 0.0, 'y': -r_adjust_3, 'z': r_adjust_3},
        {'x': -r_adjust_3, 'y': -r_adjust_3, 'z': 0.0},
        {'x': 0, 'y': -r_adjust_3, 'z': -r_adjust_3},

        {'x': 0.0, 'y': -r_adjust_4, 'z': 0.0}
    ];

    return lights_location;
}

function get_height_lights_location(radius) {
    //index_a1 = 5 - Math.ceil((vertex.y - MIN_Y + 0.125 * HEIGHT_Y) / (0.21 * HEIGHT_Y));
    var delta = radius - MAX_Y;
    var height = HEIGHT_Y + 2 * delta;

    var r_adjust_1 = radius - 0.25 * height,
        r_adjust_2 = radius - 0.5 * height,
        r_adjust_3 = radius - 0.75 * height,
        r_adjust_4 = radius - height;

    var r_adjust_1_r = radius * 0.5,
        r_adjust_2_r = radius * 0.6,
        r_adjust_3_r = radius * 0.55;

    var lights_location = [
        {'x': 0.0, 'y': radius, 'z': 0.0},

        {'x': r_adjust_1_r, 'y': r_adjust_1, 'z': 0.0},
        {'x': 0.0, 'y': r_adjust_1, 'z': r_adjust_1_r},
        {'x': -r_adjust_1_r, 'y': r_adjust_1, 'z': 0.0},
        {'x': 0, 'y': r_adjust_1, 'z': -r_adjust_1_r},

        {'x': r_adjust_2_r, 'y': r_adjust_2, 'z': 0.0},
        {'x': 0.0, 'y': r_adjust_2, 'z': r_adjust_2_r},
        {'x': -r_adjust_2_r, 'y': r_adjust_2, 'z': 0.0},
        {'x': 0, 'y': r_adjust_2, 'z': -r_adjust_2_r},

        {'x': r_adjust_3_r, 'y': r_adjust_3, 'z': 0.0},
        {'x': 0.0, 'y': r_adjust_3, 'z': r_adjust_3_r},
        {'x': -r_adjust_3_r, 'y': r_adjust_3, 'z': 0.0},
        {'x': 0, 'y': r_adjust_3, 'z': -r_adjust_3_r},

        {'x': 0.0, 'y': r_adjust_4, 'z': 0.0}
    ];

    return lights_location;
}

function get_area_lights_location(radius) {
    /*
     if (vertex.y > 0)
     index_a1 = 3 - Math.ceil(vertex.y / (MAX_Y * 0.4));
     else {
     index_a1 = 3 + Math.ceil(vertex.y / (MIN_Y * 0.8)) - 1;
     };*/
    var delta = radius - MAX_Y;

    var r_adjust_1 = radius * 0.6,
        r_adjust_2 = radius * 0.2,
        r_adjust_4 = MIN_Y - delta,
        r_adjust_3 = r_adjust_4 * 0.4;

    var r_adjust_1_r = radius * 0.5,
        r_adjust_2_r = radius * 0.6,
        r_adjust_3_r = radius * 0.55;

    var lights_location = [
        {'x': 0.0, 'y': radius, 'z': 0.0},

        {'x': r_adjust_1_r, 'y': r_adjust_1, 'z': 0.0},
        {'x': 0.0, 'y': r_adjust_1, 'z': r_adjust_1_r},
        {'x': -r_adjust_1_r, 'y': r_adjust_1, 'z': 0.0},
        {'x': 0, 'y': r_adjust_1, 'z': -r_adjust_1_r},

        {'x': r_adjust_2_r, 'y': r_adjust_2, 'z': 0.0},
        {'x': 0.0, 'y': r_adjust_2, 'z': r_adjust_2_r},
        {'x': -r_adjust_2_r, 'y': r_adjust_2, 'z': 0.0},
        {'x': 0, 'y': r_adjust_2, 'z': -r_adjust_2_r},

        {'x': r_adjust_3_r, 'y': r_adjust_3, 'z': 0.0},
        {'x': 0.0, 'y': r_adjust_3, 'z': r_adjust_3_r},
        {'x': -r_adjust_3_r, 'y': r_adjust_3, 'z': 0.0},
        {'x': 0, 'y': r_adjust_3, 'z': -r_adjust_3_r},

        {'x': 0.0, 'y': r_adjust_4, 'z': 0.0}
    ];

    return lights_location;
}

function get_lights_location(radius, sensors_layout) {
    if (sensors_layout == ANGLE_LAYOUT) {
        return get_angle_lights_location(radius);
    }
    else if (sensors_layout == HEIGHT_LAYOUT) {
        return get_height_lights_location(radius);
    }
    else {
        return get_area_lights_location(radius);
    }
}

var LIGHT_POINTS_LOC = get_lights_location(1.4, sensors_layout);

function loadModel(scene, render_type, face_inverse, sensors_layout, light_radius, light_intensity, light_type) {

    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());

    var loader = new THREE.OBJMTLLoader();
    loader.load('static/obj/egg.obj', 'static/obj/egg.mtl', function (object) {

        object.traverse(function (child) {

            if (child instanceof THREE.Mesh) {

                if (face_inverse) {
                    changeFaceOrientation(child.geometry);
                }

                if (render_type == RENDER_COLOR) {
                    var _material = new THREE.MeshLambertMaterial({ vertexColors: THREE.VertexColors });
                    child.material = _material;
                }
                else if (render_type == RENDER_LIGHT) {
                    var lights_location = get_lights_location(light_radius, sensors_layout);
                    addBlackLights(child, lights_location, light_intensity, light_type, face_inverse)
                }

                // set the axis shapes

                var axis_arrow = new THREE.AxisHelper();
                axis_arrow.position.set(0, 0, 0);
                axis_arrow.scale.x = axis_arrow.scale.y = axis_arrow.scale.z = 1.7;
                child.add(axis_arrow);

                if (face_inverse == false) {
                    child.geometry.computeFaceNormals();
                    child.geometry.computeVertexNormals();
                }

                m_mesh = child;
            }
        });

        addLightPoints(object, LIGHT_POINTS_LOC);

        object.position.x = -OBJ_CENTER.x;
        object.position.y = -OBJ_CENTER.y;
        object.position.z = -OBJ_CENTER.z;

        object.reflectivity = 0;
        object.refractionRatio = 0;

        m_object = object;
        scene.add(object);

        update_temperature(current_temperatures, render_type);
    });
}

function addEnvironmentLights(scene) {

    var ambient = new THREE.AmbientLight(0xf0f0f0);
    scene.add(ambient);

    var light = new THREE.PointLight(0xffddaa, 0.3);
    light.position.set(100, 100, 100);
    scene.add(light);

    light = new THREE.HemisphereLight(0xffddaa, 0xf0ead6, 0.8);
    light.position.set(-100, -100, -100);
    scene.add(light);
}

function addEnvironmentLights_Dark(scene, color) {

    if (color == null) color = 0xffddaa;

    var ambient = new THREE.AmbientLight(color);
    scene.add(ambient);

    var light = new THREE.PointLight(color, 0.1);
    light.position.set(100, 100, 100);
    scene.add(light);

    light = new THREE.PointLight(color, 0.1);
    light.position.set(-100, -100, -100);
    scene.add(light);
}

var BLACK = new THREE.Color(0x000000);

function addBlackLights(obj, lights_location, intensity, type, face_inverse) {

    var _light, _loc, _color;

    _color = BLACK;
    for (var i = 0; i < lights_location.length; i++) {

        _loc = lights_location[i];

        if (type == 'directional')
            _light = new THREE.DirectionalLight(_color, intensity);
        else
            _light = new THREE.PointLight(_color, intensity);

        if (face_inverse)
            _light.position.set(-_loc.x, _loc.y, -_loc.z);
        else
            _light.position.set(_loc.x, _loc.y, _loc.z);

        lights[i] = _light;

        obj.add(_light);
    }
}

var LIGHT_POINTS_MAT_RED = new THREE.MeshPhongMaterial( { color: 0xff0000 , doubleSided: true} );
var LIGHT_POINTS_MAT_WHITE = new THREE.MeshPhongMaterial( { color: 0xffffff , doubleSided: true} );
var LIGHT_POINTS_GEO = new THREE.SphereGeometry( 0.05 );

function addLightPoints(obj, lights_location) {

    var _mesh, _loc;

    for (var i = 0; i < lights_location.length; i++) {

        _loc = lights_location[i];

        _mesh = new THREE.Mesh(LIGHT_POINTS_GEO, LIGHT_POINTS_MAT_WHITE);

        if (face_inverse)
            _mesh.position.set(-_loc.x, _loc.y, -_loc.z);
        else
            _mesh.position.set(_loc.x, _loc.y, _loc.z);

        _mesh.visible = false;

        light_points[i] = _mesh;
        obj.add(_mesh);
    }
}

function vertex_in_sensor_area(vertex, layout) {

    var _angle = calc_angle(vertex, OBJ_CENTER);

    var index_a1, index_a2;

    if (layout == HEIGHT_LAYOUT) {
        index_a1 = 5 - Math.ceil((vertex.y - MIN_Y + 0.125 * HEIGHT_Y) / (0.25 * HEIGHT_Y));
    }
    else if (layout == ANGLE_LAYOUT) {
        index_a1 = Math.floor((_angle.theta_1 + 0.124) / 0.25);
    }
    else if (layout == AREA_LAYOUT) {
        if (vertex.y > 0)
            index_a1 = 3 - Math.ceil(vertex.y / (MAX_Y * 0.4));
        else {
            index_a1 = 3 + Math.ceil(vertex.y / (MIN_Y * 0.8)) - 1;
        }
    }

    index_a2 = Math.min(Math.floor((_angle.theta_2 + 0.25) / 0.5) + 2, 4);
    // index_a2 = 0;

    return {"index_a1": index_a1, "index_a2": index_a2};
}

function nearby_sensor(vertex, layout) {
    var _index = vertex_in_sensor_area(vertex, layout)
    // console.log( index.index_a1 , index.index_a2 );

    var _t1 = _index.index_a1 * 5 + _index.index_a2;
    // console.log( _t1);
    return SENSORS_NAME[ _t1 ];
}

function update_temperature(temperature_values, render_type) {
    var _color, _sensor_name, _sensor_value;
    if ((m_mesh != null) && (temperature_values != null)) {

        if (render_type == RENDER_COLOR) {
            var _face, _vertex;

            var geometry = m_mesh.geometry;
            geometry.dynamic = true;

            for (var i = 0; i < geometry.faces.length; i++) {
                _face = geometry.faces[ i ];

                var numberOfSides = ( _face instanceof THREE.Face3 ) ? 3 : 4;

                var _same_color, isEdge = false;
                for (var j = 0; j < numberOfSides; j++) {
                    _vertex = geometry.vertices[ _face[ FACE_INDICES[ j ] ]];
                    // console.log(_v)

                    _sensor_name = nearby_sensor(_vertex, sensors_layout);
                    _sensor_value = temperature_values[_sensor_name];
                    // console.log(_sensor_value);

                    _color = lut.getColor(_sensor_value);
                    _face.vertexColors[ j ] = _color;

                    if (j == 0) {
                        _same_color = _color;
                    } else {
                        if (_color != _same_color) {
                            isEdge = true;
                        }
                    }
                }

                if (isDrawEdgeLine && isEdge) {
                    for (var j = 0; j < numberOfSides; j++) {
                        _face.vertexColors[ j ] = new THREE.Color(edgecolor);
                    }
                }
            }

            geometry.colorsNeedUpdate = true;

        }
        else if (render_type == RENDER_LIGHT) {
            var _light;

            for (var j = 0; j < lights.length; j++) {
                _light = lights[j];

                _sensor_name = "temp_" + String("00" + (j + 1)).slice(-2);
                _sensor_value = temperature_values[_sensor_name];
                _color = lut.getColor(_sensor_value);

                _light.color = _color;
            }
        }
    }
}

MPU6050_RAW2G = 16384.0;
MPU6050_RAW2Angle = 131.0;

function update_position(obj, position_values) {
    var g_x = position_values["acc_x"] / MPU6050_RAW2G;
    var g_y = position_values["acc_y"] / MPU6050_RAW2G;
    var g_z = position_values["acc_z"] / MPU6050_RAW2G;

    var yaw = position_values["gyro_x"] / MPU6050_RAW2Angle;
    var pitch = position_values["gyro_y"] / MPU6050_RAW2Angle;
    var roll = position_values["gyro_z"] / MPU6050_RAW2Angle;

    var g_vector = new THREE.Vector3(g_x, g_y, g_z);

    // obj.rotation.x = roll;
    // obj.rotation.y = yaw;
    // obj.rotation.z = pitch;

    obj.lookAt(g_vector);
}

var ZERO = {x: 0, y: 0, z: 0 };
var DELTA = Math.PI / 180;

function rotate_camera_with_yAxis(camera, radius, angle, target) {
    camera.position.x = radius * Math.cos(angle);
    camera.position.z = radius * Math.sin(angle);

    camera.lookAt(target);
}

function addLabels(scene, lut) {
    var lut_legend;

    lut_legend = lut.setLegendOn({ 'layout': 'horizontal', 'position': { 'x': 0, 'y': 0, 'z': 0 },
        'dimensions': { 'width': 1.2, 'height': 1.5 } });

    scene.add(lut_legend);

    var labels = lut.setLegendLabels({ 'title': 'Temperature', 'um': '℃', 'ticks': 5, 'decimal': 0,
        'fontsize': 20 });

    scene.add(labels['title']);

    for (var i = 0; i < Object.keys(labels[ 'ticks' ]).length; i++) {
        scene.add(labels[ 'ticks' ][ i ]);
        scene.add(labels[ 'lines' ][ i ]);
    }
}

// Utils

function calc_angle(vex) {
    var _x = vex.x - OBJ_CENTER.x;
    var _y = vex.y - OBJ_CENTER.y;
    var _z = vex.z - OBJ_CENTER.z;

    var _r_xz = Math.sqrt(_x * _x + _z * _z);

    var _theta_1 = Math.atan2(_r_xz, _y) / Math.PI;
    var _theta_2 = Math.atan2(_z, _x) / Math.PI;

    return {"theta_1": _theta_1, "theta_2": _theta_2};
}

function changeFaceOrientation(geometry) {
    for (var i = 0; i < geometry.faces.length; i++) {
        var face = geometry.faces[ i ];
        if (face instanceof THREE.Face3) {
            var tmp = face.b;
            face.b = face.c;
            face.c = tmp;

        } else if (face instanceof THREE.Face4) {
            var tmp = face.b;
            face.b = face.d;
            face.d = tmp;
        }
    }
}