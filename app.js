const express = require('express');
const supabaseClient = require('@supabase/supabase-js');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const cors = require("cors");
const corsOptions = {
   origin: '*', 
   credentials: true,            
   optionSuccessStatus: 200,
}

// Ativa o CORS logo no início para evitar bloqueios no navegador
app.use(cors(corsOptions)); 

// Usando o morgan para logs de requisições
app.use(morgan('combined'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Inicialização do cliente Supabase (Sem barra no final da URL)
const supabase = supabaseClient.createClient(
    'https://nxyjjswuvfbawtzotzng.supabase.co', 
    'sb_publishable_EMCzFU_vTAUBc6JPlrx5ag_N-ROfJAl'
);

// --- 1. LISTAR TODOS OS PRODUTOS ---
app.get('/products', async (req, res) => {
    const {data, error} = await supabase
        .from('products')
        .select();
        
    if (error) {
        return res.status(500).send(error);
    }
    
    console.log(`lists all products: ${JSON.stringify(data)}`);
    return res.send(data); 
});

// --- 2. BUSCAR PRODUTO POR ID ---
app.get('/products/:id', async (req, res) => {
    console.log("id = " + req.params.id);
    const {data, error} = await supabase
        .from('products')
        .select()
        .eq('id', req.params.id);
        
    if (error) {
        return res.status(500).send(error);
    }

    console.log("retorno " + JSON.stringify(data));
    return res.send(data); 
});

// --- 3. ADICIONAR PRODUTO (POST) - CORRIGIDO! ---
app.post('/products', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .insert({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
        });
        
    if (error) {
        console.log("Erro ao inserir:", error);
        return res.status(500).send(error); // O 'return' mata a execução aqui se der erro
    }
    
    console.log("Produto criado com sucesso: " + req.body.name);
    return res.send("created!!"); // O 'return' garante o envio único da resposta de sucesso
});

// --- 4. ATUALIZAR PRODUTO (PUT) - CORRIGIDO! ---
app.put('/products/:id', async (req, res) => {
    const {error} = await supabase
        .from('products')
        .update({
            name: req.body.name,
            description: req.body.description,
            price: req.body.price
        })
        .eq('id', req.params.id);
        
    if (error) {
        return res.status(500).send(error); // Corrigido com return
    }
    
    return res.send("updated!!"); // Corrigido com return
});

// --- 5. DELETAR PRODUTO (DELETE) - CORRIGIDO! ---
app.delete('/products/:id', async (req, res) => {
    console.log("Tentando deletar ID: " + req.params.id);
    const {error} = await supabase
        .from('products')
        .delete()
        .eq('id', req.params.id);
        
    if (error) {
        return res.status(500).send(error); // Corrigido com return
    }
    
    console.log("Deletado com sucesso: " + req.params.id);
    return res.send("deleted!!"); // Corrigido com return
});

// Rotas Base e Curinga
app.get('/', (req, res) => {
    return res.send("Hello I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
    return res.send("Hello again I am working my friend to the moon and behind <3");
});

app.listen(3000, () => {
    console.log(`> Ready on http://localhost:3000`);
});