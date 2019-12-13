//------------
//---PLAYER---
//------------

export const settPlayer = {
    tamañoHitbox: 15,
    posicionInicial: { x: 100, y: 100 },
    velocidadMax: 100,
    vidaMax: 100,
};




//--------
//---UI---
//--------

export const settBarraVida = {
    posicionContainer: { x: 1, y: 1 },
    widthContainer: 170,
    posicionBarra: { x: 8, y: 7 },
    escalaBarraA_Vida: 1.6,
    margenWidth: 11,
};

export const settBarraRech = {
    posicionContainer: { x: 31, y: 35 },
    widthContainer: 250,
    margenWidth: 11,
    colorContainer: 0x85f9ff,
    posicionBarra: { x: 25, y: 41 },
    colorBarraNormal: 0x26ff00,
    colorBarraCharged: 0x707070,
    velocidadUIRecarga: 3950,
};




//-----------
//---BALAS---
//-----------

export const settBalasGeneral = {
    posicionBalasDesactivadas: { x: 50, y: 50 },
}

export const settBSimples = {
    cantidadPool: 10,
    velocidad: 500,
    aceleracion: 0,
    rebotes: 1,
    cadencia: 700,
    daño: 20,
}

export const settBRaf = {
    cantidadPool: 15,
    velocidad: 500,
    aceleracion: 0,
    rebotes: 0,
    cadencia: 1000,
    daño: 13,

    tiempoEntreBalas: 100, //en ms
}

export const settBRebot = {
    cantidadPool: 10,
    velocidad: 500,
    aceleracion: 100,
    rebotes: 5,
    cadencia: 2000,
    daño: 17,
}

export const settBMortero = {
    cantidadPool: 10,
    velocidad: 1200,    //tiempo que esta en el aire
    aceleracion: 0,
    rebotes: 1,
    cadencia: 1800,
    daño: 20,
    rango: 250,

    velocidadCrecimientoEscala: 0.1,
    velocidadDerecimientoEscala_: 0.1,

    velocidadAnimacion: 15, //en framerate

    anchoCirculoRango: 2, //pixeles
    colorCirculoRango: 0xff0000,
    variabilidadRadioCirculo : 0, //pixeles
}