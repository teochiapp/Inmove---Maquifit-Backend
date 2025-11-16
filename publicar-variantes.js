const fetch = require('node-fetch');

const STRAPI_URL = 'https://admin.inmove.com.ar'; // Cambiar según tu entorno
const API_TOKEN = 'TU_API_TOKEN'; // Opcional: si necesitas autenticación

async function publicarVariantes() {
  try {
    console.log('🔄 Obteniendo variantes...');
    
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Si tienes API token, descomenta:
    // if (API_TOKEN) {
    //   headers['Authorization'] = `Bearer ${API_TOKEN}`;
    // }
    
    const response = await fetch(
      `${STRAPI_URL}/api/variantes?pagination[pageSize]=1000&publicationState=preview`,
      { headers }
    );
    
    if (!response.ok) {
      throw new Error(`Error al obtener variantes: ${response.status}`);
    }
    
    const data = await response.json();
    const variantes = data.data || [];
    
    console.log(`📦 Total de variantes encontradas: ${variantes.length}`);
    
    let publicadas = 0;
    let errores = 0;
    
    for (const variante of variantes) {
      // Si ya está publicada, saltar
      if (variante.publishedAt) {
        console.log(`   ⏭️  Ya publicada: ${variante.Nombre || variante.id}`);
        continue;
      }
      
      try {
        const publishResponse = await fetch(
          `${STRAPI_URL}/api/variantes/${variante.documentId}/actions/publish`,
          {
            method: 'POST',
            headers
          }
        );
        
        if (publishResponse.ok) {
          publicadas++;
          console.log(`   ✓ Publicada: ${variante.Nombre || variante.id}`);
        } else {
          errores++;
          console.error(`   ✗ Error publicando ${variante.id}: ${publishResponse.status}`);
        }
      } catch (error) {
        errores++;
        console.error(`   ✗ Error: ${error.message}`);
      }
      
      // Pequeña pausa para no saturar la API
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`\n✅ Publicadas: ${publicadas}`);
    console.log(`❌ Errores: ${errores}`);
    console.log(`⏭️  Ya publicadas: ${variantes.length - publicadas - errores}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

publicarVariantes();
